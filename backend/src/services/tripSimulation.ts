import { Server } from "socket.io";
import { 
  globalTrips, 
  globalDrivers, 
  globalConfig,
  setConfig
} from "../models/db";

let simulationInterval: NodeJS.Timeout | null = null;

export function startTripSimulation(io: Server) {
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  simulationInterval = setInterval(() => {
    let changedAny = false;

    for (let i = 0; i < globalTrips.length; i++) {
      let trip = globalTrips[i];
      const statusLower = (trip.status || '').toLowerCase();
      const subStatusLower = (trip.subStatus || '').toLowerCase();
      let changed = false;

      // 1. Auto-accept pending rider requests ONLY if explicitly marked as mock/simulated demo
      if (trip.isSimulatedDemo === true && (statusLower === 'pending' || statusLower === 'searching') && trip.type === 'request' && trip.isInstant) {
        const distNum = trip.distance ? parseFloat(trip.distance.replace(/[^\d.]/g, '')) : 0;
        const localThresholdKm = globalConfig?.pricing?.localTripThresholdKm ?? 50;
        const isLocalClassificationActive = globalConfig?.rules?.find((r: any) => r.id === 'rule_local_ride_limit')?.enabled ?? true;

        const isIntercityTrip = isLocalClassificationActive
          ? (trip.tripType === 'Intercity' || String(trip.type).toLowerCase() === 'intercity' || distNum >= localThresholdKm)
          : false;

        // Evaluate simulated assignment rule from backend Rules Ground
        const isSimulatorRuleEnabled = globalConfig?.rules?.find((r: any) => r.id === 'rule_auto_accept_bypass')?.enabled ?? false;
        if (!isSimulatorRuleEnabled) {
          continue; // Bypass automatic assignment when disabled
        }

        trip.status = 'Accepted';
        trip.subStatus = 'arriving';
        
        let mockDriver;
        if (isIntercityTrip) {
          // INTERCITY TRIP (>= 50 km): Always assign the non-local-only driver (Kabir Swift Car Driver). Skip bike/auto.
          mockDriver = globalDrivers["DRV26HYM57P8Z1K"];
        } else {
          // LOCAL TRIP (< 50 km)
          const isBike = (trip.rideOptionName || '').toLowerCase().includes('bike') || (trip.vehicle || '').toLowerCase().includes('bike');
          const isAuto = (trip.rideOptionName || '').toLowerCase().includes('auto') || (trip.vehicle || '').toLowerCase().includes('auto');
          const isPremium = (trip.rideOptionName || '').toLowerCase().includes('sedan') || (trip.rideOptionName || '').toLowerCase().includes('suv') || (trip.vehicle || '').toLowerCase().includes('sedan') || (trip.vehicle || '').toLowerCase().includes('suv') || (trip.rideOptionName || '').toLowerCase().includes('prime') || (trip.vehicle || '').toLowerCase().includes('prime');
          
          if (isBike) {
            mockDriver = globalDrivers["DRV26HYT92W1Z4B"];
          } else if (isAuto) {
            mockDriver = globalDrivers["DRV26PUR48X2B1D"];
          } else if (isPremium) {
            mockDriver = globalDrivers["DRV26HYN15X2P8R"] || globalDrivers["DRV26HYM57P8Z1K"];
          } else {
            // Randomly pick between Kabir Malhotra and Siddharth Khanna for variety
            const carDrivers = ["DRV26HYM57P8Z1K", "DRV26HYN15X2P8R"];
            const chosenId = carDrivers[Math.floor(Math.random() * carDrivers.length)];
            mockDriver = globalDrivers[chosenId] || globalDrivers["DRV26HYM57P8Z1K"];
          }
        }
        
        trip.driver = {
          name: mockDriver.name,
          rating: mockDriver.rating,
          vehicle: mockDriver.vehicle,
          plate: mockDriver.vehicle.split('(')[1]?.replace(')', '') || 'TS09 EN 9012',
          avatar: `https://picsum.photos/seed/${mockDriver.name}/100/100`
        };
        trip.acceptedBy = mockDriver.id;
        trip.driverCoords = mockDriver.coords || [17.3850, 78.4867];
        trip.driverRotation = 0;
        trip.simStep = 0;
        
        io.to(`trip_${trip.id}`).emit("trip_update", trip);
        io.to(`user_${trip.ownerId}`).emit("active_trip_update", trip);
        io.emit("trip_update", trip);
        continue;
      }

      // 2. Drive process simulation (Arriving -> Pickup -> Started -> Completed)
      if (['accepted', 'active', 'started'].includes(statusLower) && !trip.postId) {
        // In production mode (testMode: false), do NOT simulate real trips — real drivers drive manually!
        if (!trip.isSimulatedDemo && globalConfig?.testMode !== true) {
          continue;
        }

        // If this trip is being handled by a real active human driver, do physical simulation bypass
        const assignedDriver = globalDrivers[trip.acceptedBy];
        if (assignedDriver && assignedDriver.isRealUser) {
          continue; // Let the real driver drive the trip manually in their app!
        }

        trip.simStep = (trip.simStep || 0) + 1;

        if (statusLower === 'accepted') {
          if (subStatusLower === '' || subStatusLower === 'accepted' || subStatusLower === 'arriving') {
            // Update driver coords moving towards pickup point
            const end = (trip.pickup && [trip.pickup.lat, trip.pickup.lng]) || trip.pickupCoords || [17.3850, 78.4867];
            // Intelligent local arrival starting point near the rider's pickup location (approx 1 - 1.5 km offset)
            const seed = parseInt((trip.id || '').replace(/[^\d]/g, '') || '135');
            const offsetLat = -0.007 + (Math.sin(seed) * 0.003);
            const offsetLng = 0.007 + (Math.cos(seed) * 0.003);
            const start = [end[0] + offsetLat, end[1] + offsetLng];
            const maxSteps = 4;
            const ratio = Math.min(1, trip.simStep / maxSteps);
            trip.driverCoords = [
              start[0] + (end[0] - start[0]) * ratio,
              start[1] + (end[1] - start[1]) * ratio
            ];
            
            // simple approximate rotation angle
            const dy = end[0] - start[0];
            const dx = end[1] - start[1];
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            trip.driverRotation = 90 - angle;

            if (trip.simStep >= maxSteps) {
              trip.subStatus = 'pickup';
              trip.simStep = 0;
            }
            changed = true;
          } 
          else if (subStatusLower === 'pickup') {
            // Wait at pickup, then auto-verify onboarding and start trip!
            // We give it 3 ticks (12 seconds) for OTP visualization before boarding is verified
            if (trip.simStep >= 3) {
              trip.status = 'started';
              trip.subStatus = 'started';
              trip.simStep = 0;
              trip.driverCoords = (trip.pickup && [trip.pickup.lat, trip.pickup.lng]) || trip.pickupCoords || [17.3850, 78.4867];
            }
            changed = true;
          }
        } 
        else if (statusLower === 'started') {
          // Drive with smooth step interpolation to drop-off point
          const start = (trip.pickup && [trip.pickup.lat, trip.pickup.lng]) || trip.pickupCoords || [17.3850, 78.4867];
          const end = (trip.drop && [trip.drop.lat, trip.drop.lng]) || trip.dropCoords || [17.4948, 78.3996];
          const maxSteps = 6;
          const ratio = Math.min(1, trip.simStep / maxSteps);
          trip.driverCoords = [
            start[0] + (end[0] - start[0]) * ratio,
            start[1] + (end[1] - start[1]) * ratio
          ];
          
          const dy = end[0] - start[0];
          const dx = end[1] - start[1];
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          trip.driverRotation = 90 - angle;

          if (trip.simStep >= maxSteps) {
            trip.status = 'completed';
            trip.subStatus = 'completed';
            trip.isFinished = true;
            trip.simStep = 0;
          }
          changed = true;
        }

        if (changed) {
          io.to(`trip_${trip.id}`).emit("trip_update", trip);
          io.to(`user_${trip.ownerId}`).emit("active_trip_update", trip);
          io.emit("trip_update", trip);
        }
      }
    }
  }, 4000);
}

export function stopTripSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}
