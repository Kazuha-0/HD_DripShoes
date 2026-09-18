import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  producto: any;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  // Agregar producto al carrito
  agregarProducto(producto: any, cantidad: number = 1): void {
    const itemsActuales = this.itemsSubject.getValue();
    const index = itemsActuales.findIndex(item => item.producto.id === producto.id);

    if (index > -1) {
      itemsActuales[index].cantidad += cantidad;
    } else {
      itemsActuales.push({ producto, cantidad });
    }

    this.itemsSubject.next([...itemsActuales]);
  }

  // Obtener la cantidad total de ítems
  get TotalItems(): number {
    return this.itemsSubject.getValue().reduce((total, item) => total + item.cantidad, 0);
  }

  // Obtener el precio total
  get TotalPrecio(): number {
    return this.itemsSubject.getValue().reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  }

  // Limpiar el carrito
  limpiarCarrito(): void {
    this.itemsSubject.next([]);
  }
}