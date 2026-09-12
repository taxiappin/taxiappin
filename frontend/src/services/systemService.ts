/**
 * Service to handle Web Notifications and UI Sounds
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNotification() {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playTripAlert() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square'; // Sharper sound
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    // Rhythmic triple beep
    playTone(523.25, now, 0.1); 
    playTone(523.25, now + 0.2, 0.1);
    playTone(659.25, now + 0.4, 0.3);
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.05, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };
    playTone(587.33, now, 0.1);
    playTone(783.99, now + 0.1, 0.2);
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playError() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.05, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };
    playTone(220, now, 0.1);
    playTone(110, now + 0.1, 0.2);
  }

  playAlert() {
    this.playTripAlert();
  }
}

export const soundService = new SoundEngine();

export const notificationService = {
  async requestPermission() {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  async show(title: string, body: string, icon = 'https://cdn-icons-png.flaticon.com/512/3082/3082331.png') {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      try {
        // Android Chrome requires ServiceWorker for reliable background notifications
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration && 'showNotification' in registration) {
            await registration.showNotification(title, {
              body,
              icon,
              badge: icon,
              vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40], 
              tag: 'ride-buddy-notification', 
              renotify: true,
              requireInteraction: true,
              silent: false,
              data: {
                url: window.location.origin
              }
            } as any);
            return;
          }
        }
        
        // Fallback for when ServiceWorker isn't ready or for desktop
        new Notification(title, {
          body,
          icon,
          badge: icon,
          tag: 'ride-buddy-notification'
        });
      } catch (e) {
        console.warn('Notification failed, falling back to window.Notification', e);
        try {
          new Notification(title, { body, icon });
        } catch (innerErr) {
          console.error('All notification methods failed', innerErr);
        }
      }
    }
  }
};
