import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(): void {
    if (this.socket) return;

    this.socket = io(process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Set up default event listeners
    this.setupDefaultListeners();
  }

  private setupDefaultListeners(): void {
    if (!this.socket) return;

    this.socket.on('ride-request', (rideData) => {
      this.notifyListeners('ride-request', rideData);
    });

    this.socket.on('ride-status-update', (statusData) => {
      this.notifyListeners('ride-status-update', statusData);
    });

    this.socket.on('driver-location-update', (locationData) => {
      this.notifyListeners('driver-location-update', locationData);
    });

    this.socket.on('hazard-zone-update', (hazardData) => {
      this.notifyListeners('hazard-zone-update', hazardData);
    });
  }

  addEventListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  removeEventListener(event: string, callback: Function): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.delete(callback);
    }
  }

  private notifyListeners(event: string, data: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.forEach(callback => callback(data));
    }
  }

  emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService(); 