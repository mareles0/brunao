import { randomBytes } from 'crypto';

export class Vehicle {
  constructor(plate, spaceId) {
    this.id = this.generateId();
    this.plate = plate.toUpperCase();
    this.entryTime = new Date();
    this.exitTime = null;
    this.spaceId = spaceId;
    this.status = 'parked';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  generateId() {
    return `${Date.now()}-${randomBytes(4).toString('hex')}`;
  }

  exit() {
    this.exitTime = new Date();
    this.status = 'exited';
    this.updatedAt = new Date();
  }

  getStayDuration() {
    const endTime = this.exitTime || new Date();
    const durationMs = endTime - this.entryTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  }
}

export class ParkingSpace {
  constructor(id) {
    this.id = id;
    this.status = 'free';
    this.vehiclePlate = null;
    this.section = id.charAt(0);
    this.number = parseInt(id.substring(1));
    this.lastOccupiedAt = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  occupy(vehiclePlate) {
    this.status = 'occupied';
    this.vehiclePlate = vehiclePlate;
    this.lastOccupiedAt = new Date();
    this.updatedAt = new Date();
  }

  free() {
    this.status = 'free';
    this.vehiclePlate = null;
    this.updatedAt = new Date();
  }
}
