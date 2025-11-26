import { Vehicle, ParkingSpace } from '../models/Models.js';

const TOTAL_SPACES = 300;

class ParkingService {
  constructor() {
    this.vehicles = [];
    this.spaces = this.initializeSpaces();
  }

  initializeSpaces() {
    const spaces = [];
    for (let i = 1; i <= TOTAL_SPACES; i++) {
      const section = String.fromCharCode(65 + Math.floor((i - 1) / 20));
      const number = ((i - 1) % 20) + 1;
      const spaceId = `${section}${String(number).padStart(2, '0')}`;
      spaces.push(new ParkingSpace(spaceId));
    }
    return spaces;
  }

  getAllSpaces() {
    return this.spaces;
  }

  getSpaceById(id) {
    return this.spaces.find(space => space.id === id);
  }

  getFreeSpaces() {
    return this.spaces.filter(space => space.status === 'free');
  }

  getOccupiedSpaces() {
    return this.spaces.filter(space => space.status === 'occupied');
  }

  getAllVehicles() {
    return this.vehicles.filter(v => v.status === 'parked');
  }

  getVehicleByPlate(plate) {
    return this.vehicles.find(
      v => v.plate === plate.toUpperCase() && v.status === 'parked'
    );
  }

  getVehicleHistory() {
    return this.vehicles;
  }

  parkVehicle(plate, spaceId) {
    const normalizedPlate = plate.toUpperCase();

    const existingVehicle = this.getVehicleByPlate(normalizedPlate);
    if (existingVehicle) {
      throw new Error('Veículo com esta placa já está estacionado.');
    }

    const space = this.getSpaceById(spaceId);
    if (!space) {
      throw new Error('Vaga não encontrada.');
    }

    if (space.status !== 'free') {
      throw new Error(`Vaga ${spaceId} não está disponível.`);
    }

    const vehicle = new Vehicle(normalizedPlate, spaceId);
    this.vehicles.push(vehicle);
    space.occupy(normalizedPlate);

    return vehicle;
  }

  unparkVehicle(plate) {
    const normalizedPlate = plate.toUpperCase();
    const vehicle = this.getVehicleByPlate(normalizedPlate);

    if (!vehicle) {
      throw new Error('Veículo não encontrado ou já saiu.');
    }

    const space = this.getSpaceById(vehicle.spaceId);
    if (space) {
      space.free();
    }

    vehicle.exit();
    return vehicle;
  }

  getStatistics() {
    const parkedVehicles = this.vehicles.filter(v => v.status === 'parked');
    const occupiedSpaces = parkedVehicles.length;
    const freeSpaces = TOTAL_SPACES - occupiedSpaces;
    const occupancyRate = Math.round((occupiedSpaces / TOTAL_SPACES) * 100);

    let totalStayMillis = 0;
    parkedVehicles.forEach(v => {
      totalStayMillis += Date.now() - v.entryTime.getTime();
    });

    const avgMillis = parkedVehicles.length > 0 ? totalStayMillis / parkedVehicles.length : 0;
    const avgHours = Math.floor(avgMillis / (1000 * 60 * 60));
    const avgMinutes = Math.floor((avgMillis % (1000 * 60 * 60)) / (1000 * 60));
    const averageStayTime = `${avgHours}h ${avgMinutes}min`;

    return {
      totalSpaces: TOTAL_SPACES,
      occupiedSpaces,
      freeSpaces,
      occupancyRate,
      averageStayTime
    };
  }

  findNextFreeSpace() {
    return this.spaces.find(space => space.status === 'free');
  }
}

export default new ParkingService();
