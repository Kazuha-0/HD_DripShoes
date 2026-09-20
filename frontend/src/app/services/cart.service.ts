import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  producto: any;
  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'dripshoes_cart';

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  // Controla si el panel lateral del carrito (en el navbar) está abierto
  carritoAbierto: boolean = false;

  constructor() {
    this.cargar();
  }

  // Lista actual de ítems
  get items(): CartItem[] {
    return this.itemsSubject.getValue();
  }

  // Agregar producto al carrito
  agregarProducto(producto: any, cantidad: number = 1): void {
    const itemsActuales = this.itemsSubject.getValue();
    const index = itemsActuales.findIndex(
      (item) => item.producto.id === producto.id,
    );

    if (index > -1) {
      itemsActuales[index].cantidad += cantidad;
    } else {
      itemsActuales.push({ producto, cantidad });
    }

    this.itemsSubject.next([...itemsActuales]);
    this.guardar();
  }

  // Restar una unidad (si llega a 0, se quita del carrito)
  disminuirProducto(id: any): void {
    const actualizados = this.items
      .map((item) =>
        item.producto.id === id
          ? { ...item, cantidad: item.cantidad - 1 }
          : item,
      )
      .filter((item) => item.cantidad > 0);

    this.itemsSubject.next(actualizados);
    this.guardar();
  }

  // Quitar un producto completo
  quitarProducto(id: any): void {
    this.itemsSubject.next(
      this.items.filter((item) => item.producto.id !== id),
    );
    this.guardar();
  }

  // Obtener la cantidad total de ítems
  get TotalItems(): number {
    return this.itemsSubject
      .getValue()
      .reduce((total, item) => total + item.cantidad, 0);
  }

  // Obtener el precio total
  get TotalPrecio(): number {
    return this.itemsSubject
      .getValue()
      .reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }

  // Limpiar el carrito
  limpiarCarrito(): void {
    this.itemsSubject.next([]);
    this.guardar();
  }

  // Panel lateral
  abrirCarrito(): void {
    this.carritoAbierto = true;
  }

  cerrarCarrito(): void {
    this.carritoAbierto = false;
  }

  toggleCarrito(): void {
    this.carritoAbierto = !this.carritoAbierto;
  }

  // Persistencia
  private guardar(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    } catch {}
  }

  private cargar(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) this.itemsSubject.next(JSON.parse(data));
    } catch {
      this.itemsSubject.next([]);
    }
  }
}
