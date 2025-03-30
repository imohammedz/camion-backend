
export interface Truck {
  id: string;
  truck_model: string;
  registration_number: string;
  manufacturer: string;
  year_of_manufacture: string;
  capacity: string;
  dimensions: string;
  fuel_type: string;
  mileage: string;
  status: TruckStatus;
  driver_id?: string;
  fleet_id:string;
}

export enum TruckStatus {
    AVAILABLE = 'AVAILABLE',
    UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
    OUT_OF_SERVICE = 'OUT_OF_SERVICE',
    IN_TRANSIT = 'IN_TRANSIT',
    LOADING = 'LOADING',
    UNLOADING = 'UNLOADING',
    WAITING_FOR_ASSIGNMENT = 'WAITING_FOR_ASSIGNMENT',
    IDLE = 'IDLE',
    ON_SALE = 'ON_SALE'
  }