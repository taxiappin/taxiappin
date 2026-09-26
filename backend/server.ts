import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import { createApp } from "./app";
import { initDb, globalDrivers, globalTrips, globalSupportChats, setDbIo } from "./src/models/db";
import { startTripSimulation } from "./src/services/tripSimulation";
import { setGlobalIo } from "./src/services/webPushService";

async function run() {
  const PORT = 3000;

  // Initialize DB
  await initDb();

  // Create Express App
  const app = await createApp();

  // Create HTTP server
  const httpServer = createServer(app);

  // Set up socket.io
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  // Make socket.io instance accessible in controllers, models, and push services
  app.set("io", io);
  setGlobalIo(io);
  setDbIo(io);

  // Set up Socket.io event listners
  io.on("connection", (socket) => {
    console.log(`[SOCKET] User connected: ${socket.id}`);

    socket.on("join_trip_room", (tripId) => {
      socket.join(`trip_${tripId}`);
      console.log(`[SOCKET] User joined trip room: trip_${tripId}`);
    });

    socket.on("join_user_room", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`[SOCKET] User joined user room: user_${userId}`);
    });

    socket.on("driver_status_update", (driverData) => {
      const { id, status, coords, rotation } = driverData;
      if (id) {
        globalDrivers[id] = { 
          ...globalDrivers[id], 
          ...driverData, 
          lastSeen: Date.now(),
          isRealUser: status !== 'offline'
        };
        io.emit("driver_update", globalDrivers[id]);

        // Real-Time Location Synchronization: If this driver has an active trip, sync coords to the trip
        if (coords) {
          for (let i = 0; i < globalTrips.length; i++) {
            const trip = globalTrips[i];
            const tripDriverId = trip.driverId || trip.acceptedBy;
            const tripStatus = trip.status?.toLowerCase();
            const isNotClosed = !['cancelled', 'completed', 'delivered'].includes(tripStatus);
            if (tripDriverId === id && isNotClosed) {
              trip.driverCoords = coords;
              if (rotation !== undefined) {
                trip.driverRotation = rotation;
              }
              // Notify rider of location shift
              io.to(`user_${trip.ownerId}`).emit("active_trip_update", trip);
              io.to(`trip_${trip.id}`).emit("trip_update", trip);
            }
          }
        }
      }
    });

    socket.on("trip_location_update", (data) => {
      if (data && data.tripId && data.coords) {
        io.to(`trip_${data.tripId}`).emit("driver_update", {
          id: data.driverId || data.tripId,
          coords: data.coords,
          rotation: data.rotation,
          heading: data.rotation,
        });
        io.to(`trip_${data.tripId}`).emit("active_trip_update", {
          id: data.tripId,
          driverCoords: data.coords,
          driverRotation: data.rotation,
        });
      }
    });

    socket.on("get_nearby_drivers", (coords) => {
      if (!coords) return;
      const activeThreshold = Date.now() - 30000;
      Object.values(globalDrivers).forEach(d => {
        if (d.id.startsWith("driver_") || d.lastSeen > activeThreshold) {
          socket.emit("driver_update", d);
        }
      });
    });

    socket.on("send_on_demand_request", (reqData) => {
      console.log(`[SOCKET ON DEMAND] Forwarding request to room user_${reqData.driverId}`, reqData);
      io.to(`user_${reqData.driverId}`).emit("incoming_on_demand_request", reqData);
      
      // Broadcast widely so any connected real driver in testing/development can intercept/receive the request popup
      io.emit("incoming_on_demand_request", reqData);
    });

    socket.on("respond_on_demand_request", (responseData) => {
      console.log(`[SOCKET ON DEMAND] Forwarding response to room user_${responseData.riderId}`, responseData);
      io.to(`user_${responseData.riderId}`).emit("on_demand_request_response", responseData);
    });

    socket.on("driver_kyc_submitted", (driverData) => {
      if (driverData && (driverData.driverId || driverData.id)) {
        const id = driverData.driverId || driverData.id;
        const updated = {
          ...globalDrivers[id],
          ...driverData,
          id,
          lastSeen: Date.now()
        };
        globalDrivers[id] = updated;
        console.log(`[SOCKET KYC UPDATE] Real-time KYC submission received for driver ${id}`);
        io.emit("driver_update", updated);
        io.emit("driver_kyc_updated", updated);
      }
    });

    socket.on("support_chat_message", (msg) => {
      if (!msg || !msg.text) return;
      const targetId = msg.driverId || msg.verifyId || "DRV_GUEST";
      if (!globalSupportChats[targetId]) {
        globalSupportChats[targetId] = [];
      }
      if (!globalSupportChats[targetId].some(m => m.id === msg.id)) {
        globalSupportChats[targetId].push(msg);
      }
      console.log(`[SOCKET SUPPORT CHAT] Message from ${msg.sender} for driver ${targetId}: "${msg.text}"`);
      io.emit("support_chat_message", msg);
    });

    socket.on("trip_update", (tripData) => {
      if (!tripData) return;
      console.log(`[SOCKET] Relaying trip_update for trip ${tripData.id}`);
      io.emit("trip_update", tripData);
      if (tripData.id) io.to(`trip_${tripData.id}`).emit("trip_update", tripData);
      if (tripData.ownerId) io.to(`user_${tripData.ownerId}`).emit("active_trip_update", tripData);
      if (tripData.riderId) io.to(`user_${tripData.riderId}`).emit("active_trip_update", tripData);
      if (tripData.driverId) io.to(`user_${tripData.driverId}`).emit("active_trip_update", tripData);
    });

    socket.on("new_trip_alert", (tripData) => {
      if (!tripData) return;
      console.log(`[SOCKET] Relaying new_trip_alert for trip ${tripData.id}`);
      io.emit("new_trip_alert", tripData);
      io.emit("trip_update", tripData);
    });

    socket.on("trip_created", (tripData) => {
      if (!tripData) return;
      console.log(`[SOCKET] Relaying trip_created for trip ${tripData.id}`);
      io.emit("new_trip_alert", tripData);
      io.emit("trip_update", tripData);
      io.emit("trip_created", tripData);
    });

    socket.on("disconnect", () => {
      console.log(`[SOCKET] User disconnected: ${socket.id}`);
    });
  });

  // Start Background Trip Simulation
  startTripSimulation(io);

  // Listen
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Ready & running on http://localhost:${PORT}`);
  });
}

run().catch((err) => {
  console.error("[SERVER FATAL ERROR] Failed to boot backend:", err);
});
