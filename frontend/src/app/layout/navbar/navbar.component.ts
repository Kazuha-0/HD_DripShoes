import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuAbierto: boolean = false;
  textoBusqueda: string = '';

  mostrarLoginModal: boolean = false;
  modoAuth: 'login' | 'registro' = 'login';

  constructor(private router: Router) {}

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

  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.textoBusqueda = input.value;
    this.ejecutarBusqueda();
  }

  ejecutarBusqueda(): void {
    if (this.textoBusqueda.trim()) {
      this.router.navigate(['/catalogo'], { queryParams: { q: this.textoBusqueda } });
      this.cerrarMenu();
    }
  }
}