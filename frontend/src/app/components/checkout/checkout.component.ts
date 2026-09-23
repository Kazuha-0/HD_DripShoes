import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  @Input() items: any[] = [];
  @Input() total: number = 0;
  @Output() close = new EventEmitter<void>();

  private cartService = inject(CartService);
  private router = inject(Router);

  fechaActual: string = new Date().toLocaleDateString('es-PE');
  numeroComprobante: string = 'B001-' + Math.floor(100000 + Math.random() * 900000);

  obtenerNombre(item: any): string {
    return item.producto ? item.producto.nombre : (item.nombre || 'Producto');
  }

  obtenerPrecio(item: any): number {
    return item.producto ? item.producto.precio : (item.precio || 0);
  }

  obtenerSubtotal(item: any): number {
    return this.obtenerPrecio(item) * item.cantidad;
  }

  imprimir() {
    window.print();
  }

 volverAlInicio() {
    this.cartService.limpiarCarrito(); // <-- Usamos limpiarCarrito()
    this.close.emit();
    this.router.navigate(['/']);
  }
}