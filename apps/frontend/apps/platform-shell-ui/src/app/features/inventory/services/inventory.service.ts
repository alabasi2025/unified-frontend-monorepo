import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Interfaces
export interface Warehouse {
  id: number;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
}

export interface WarehouseStats {
  totalWarehouses: number;
  totalCapacity: number;
  occupiedCapacity: number;
  freeCapacity: number;
}

export interface Movement {
  id: number;
  type: 'in' | 'out';
  itemId: number;
  itemName: string;
  quantity: number;
  warehouseId: number;
  date: Date;
}

export interface MovementStats {
  totalIn: number;
  totalOut: number;
  netMovement: number;
  lastMovementDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  // Mock Data
  private mockWarehouses: Warehouse[] = [
    { id: 1, name: 'Main Warehouse', location: 'Riyadh', capacity: 10000, currentStock: 7500 },
    { id: 2, name: 'Secondary Storage', location: 'Jeddah', capacity: 5000, currentStock: 3000 },
  ];

  private mockMovements: Movement[] = [
    { id: 101, type: 'in', itemId: 1, itemName: 'Product A', quantity: 500, warehouseId: 1, date: new Date('2025-11-01') },
    { id: 102, type: 'out', itemId: 2, itemName: 'Product B', quantity: 100, warehouseId: 2, date: new Date('2025-11-05') },
    { id: 103, type: 'in', itemId: 1, itemName: 'Product A', quantity: 200, warehouseId: 1, date: new Date('2025-11-10') },
  ];

  constructor() { }

  /**
   * Retrieves a list of all warehouses.
   * @returns An Observable of an array of Warehouse objects.
   */
  getWarehouses(): Observable<Warehouse[]> {
    return of(this.mockWarehouses);
  }

  /**
   * Retrieves statistics for all warehouses.
   * @returns An Observable of a WarehouseStats object.
   */
  getWarehouseStats(): Observable<WarehouseStats> {
    const stats: WarehouseStats = {
      totalWarehouses: this.mockWarehouses.length,
      totalCapacity: this.mockWarehouses.reduce((sum, w) => sum + w.capacity, 0),
      occupiedCapacity: this.mockWarehouses.reduce((sum, w) => sum + w.currentStock, 0),
      freeCapacity: this.mockWarehouses.reduce((sum, w) => sum + (w.capacity - w.currentStock), 0),
    };
    return of(stats);
  }

  /**
   * Retrieves a list of recent inventory movements.
   * @returns An Observable of an array of Movement objects.
   */
  getMovements(): Observable<Movement[]> {
    return of(this.mockMovements);
  }

  /**
   * Retrieves statistics for inventory movements.
   * @returns An Observable of a MovementStats object.
   */
  getMovementStats(): Observable<MovementStats> {
    const totalIn = this.mockMovements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0);
    const totalOut = this.mockMovements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0);
    const lastMovementDate = this.mockMovements.reduce((latest, m) => m.date > latest ? m.date : latest, new Date(0));

    const stats: MovementStats = {
      totalIn: totalIn,
      totalOut: totalOut,
      netMovement: totalIn - totalOut,
      lastMovementDate: lastMovementDate,
    };
    return of(stats);
  }

  /**
   * Placeholder method for showing a toast notification.
   * In a real application, this would interact with a notification service.
   * @param message The message to display.
   * @param type The type of notification (e.g., 'success', 'error').
   */
  showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    console.log(`[Toast - ${type.toUpperCase()}]: ${message}`);
    // Implementation for showing a toast would go here
  }
}
