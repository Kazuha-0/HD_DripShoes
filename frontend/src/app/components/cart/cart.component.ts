import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  private cartService = inject(CartService);
  private router = inject(Router);

  @Output() close = new EventEmitter<void>();
  @Output() openCheckout = new EventEmitter<void>();

  get items() {
    return this.cartService.items;
  }

  get totalItems() {
    return this.cartService.TotalItems;
  }

  get totalPrecio() {
    return this.cartService.TotalPrecio;
  }

  cerrarCarrito() {
    this.cartService.cerrarCarrito();
    this.close.emit();
  }

seguirComprando() {
    this.cerrarCarrito();
  }

  aumentarCantidad(item: any) {
    this.cartService.agregarProducto(item.producto || item);
  }

  disminuirCantidad(item: any) {
    const id = item.producto ? item.producto.id : item.id;
    this.cartService.disminuirProducto(id);
  }

  eliminarProducto(item: any) {
    const id = item.producto ? item.producto.id : item.id;
    this.cartService.quitarProducto(id);
  }

  irAlCheckout() {
    this.openCheckout.emit();
  }

  obtenerNombre(item: any): string {
    return item.producto ? item.producto.nombre : (item.nombre || '');
  }

  obtenerMarca(item: any): string {
    return item.producto ? item.producto.marca : (item.marca || '');
  }

  obtenerImagen(item: any): string {
    return (item.producto ? item.producto.imagen : item.imagen) || 'assets/placeholder.jpg';
  }

  obtenerPrecio(item: any): number {
    return item.producto ? item.producto.precio : (item.precio || 0);
  }

  obtenerSubtotal(item: any): number {
    return this.obtenerPrecio(item) * item.cantidad;
  }
}