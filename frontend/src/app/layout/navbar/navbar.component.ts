import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private router = inject(Router);
  private cartService = inject(CartService);

  menuAbierto: boolean = false;
  textoBusqueda: string = '';

  mostrarLoginModal: boolean = false;
  mostrarCarritoModal: boolean = false;
  modoAuth: 'login' | 'registro' = 'login';

  registro = {
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    password: '',
  };

  get totalItemsCart(): number {
    return this.cartService.TotalItems;
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  abrirLoginModal(): void {
    this.mostrarLoginModal = true;
    this.cerrarMenu();
  }

  cerrarLoginModal(): void {
    this.mostrarLoginModal = false;
  }

  registrarse(): void {
    console.log('Datos de registro:', this.registro);
    // Aquí luego llamas a tu servicio o backend para guardar al usuario
  }

  toggleCarritoModal(): void {
    this.mostrarCarritoModal = !this.mostrarCarritoModal;
    this.cerrarMenu();
  }

  cerrarCarritoModal(): void {
    this.mostrarCarritoModal = false;
  }

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.textoBusqueda = input.value;
    this.ejecutarBusqueda();
  }

  ejecutarBusqueda(): void {
    if (this.textoBusqueda.trim()) {
      this.router.navigate(['/catalogo'], {
        queryParams: { q: this.textoBusqueda },
      });
      this.cerrarMenu();
    }
  }
}
