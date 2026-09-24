import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CartComponent,
    CheckoutComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private cartService = inject(CartService);

  mostrarCheckout = false;

  get mostrarCarrito(): boolean {
    return this.cartService.carritoAbierto;
  }

  cerrarCarrito() {
    this.cartService.cerrarCarrito();
  }

  abrirCheckout() {
    this.cartService.cerrarCarrito();
    this.mostrarCheckout = true;
  }

  cerrarCheckout() {
    this.mostrarCheckout = false;
  }

  get itemsCarrito() {
    return this.cartService.items;
  }

  get totalCarrito() {
    return this.cartService.TotalPrecio;
  }
}