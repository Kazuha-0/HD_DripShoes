
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  producto: any;
  cantidad: number;
  talla: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'dripshoes_cart';

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  carritoAbierto: boolean = false;

  constructor() {
    this.cargar();
  }

  get items(): CartItem[] {
    return this.itemsSubject.getValue();
  }

  agregarProducto(producto: any, cantidad: number = 1, talla: string = ''): void {
  const itemsActuales = this.itemsSubject.getValue();

  const index = itemsActuales.findIndex(
    (item) => item.producto.id === producto.id && item.talla === talla
  );

  if (index > -1) {
    itemsActuales[index].cantidad += cantidad;
  } else {
    itemsActuales.push({ producto, cantidad, talla });
  }

  this.itemsSubject.next([...itemsActuales]);
  this.guardar();
}

  disminuirProducto(id: any, talla: string = ''): void {
  const actualizados = this.items
    .map((item) =>
      item.producto.id === id && item.talla === talla
        ? { ...item, cantidad: item.cantidad - 1 }
        : item
    )
    .filter((item) => item.cantidad > 0);

  this.itemsSubject.next(actualizados);
  this.guardar();
}

  quitarProducto(id: any, talla: string = ''): void {
  this.itemsSubject.next(
    this.items.filter(
      (item) => !(item.producto.id === id && item.talla === talla)
    )
  );

  this.guardar();
}

  get TotalItems(): number {
    return this.itemsSubject
      .getValue()
      .reduce((total, item) => total + item.cantidad, 0);
  }

  get TotalPrecio(): number {
    return this.itemsSubject
      .getValue()
      .reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }

  limpiarCarrito(): void {
    this.itemsSubject.next([]);
    this.guardar();
  }

  abrirCarrito(): void {
    this.carritoAbierto = true;
  }

  cerrarCarrito(): void {
    this.carritoAbierto = false;
  }

  toggleCarrito(): void {
    this.carritoAbierto = !this.carritoAbierto;
  }

  private guardar(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    } catch {}
  }

  private cargar(): void {
  try {
    const data = localStorage.getItem(this.STORAGE_KEY);

    if (data) {
      const items = JSON.parse(data);
      this.itemsSubject.next(
        items.map((item: any) => ({
          ...item,
          talla: item.talla || ''
        }))
      );
    }
  } catch {
    this.itemsSubject.next([]);
  }
}
}
