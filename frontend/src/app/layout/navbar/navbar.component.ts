import { Component, HostListener, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe], // DecimalPipe para el pipe "number"
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);

  menuAbierto: boolean = false;
  mostrarLoginModal: boolean = false;
  mostrarCarritoModal: boolean = false;
  modoAuth: 'login' | 'registro' = 'login';

  // Búsqueda
  textoBusqueda: string = '';
  productos: Product[] = [];
  resultados: Product[] = [];
  mostrarResultados: boolean = false;

  // Modal de vista rápida
  productoSeleccionado: any = null;

  registro = {
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    password: '',
  };

  ngOnInit(): void {
    this.productService.getProductos().subscribe({
      next: (data) => (this.productos = data),
      error: (err) =>
        console.error('Error al cargar productos en el navbar:', err),
    });
  }

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

  // ---------- BÚSQUEDA ----------
  // Quita tildes y pasa a minúsculas: "Zapatilla" encuentra "zapatilla" y "zapatíllá"
  private normalizar(texto: string): string {
    return (texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  filtrar(): void {
    const q = this.normalizar(this.textoBusqueda.trim());

    if (!q) {
      this.resultados = [];
      this.mostrarResultados = false;
      return;
    }

    this.resultados = this.productos
      .filter((p) =>
        this.normalizar(
          `${p.nombre} ${p.marca} ${p.descripcion ?? ''}`,
        ).includes(q),
      )
      .slice(0, 6); // máximo 6 sugerencias

    this.mostrarResultados = true;
  }

  // Enter: abre el primer resultado
  abrirPrimerResultado(): void {
    this.filtrar();
    if (this.resultados.length > 0) {
      this.abrirVistaRapida(this.resultados[0]);
    }
  }

  // Cierra la lista si haces clic fuera del buscador
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-search')) {
      this.mostrarResultados = false;
    }
  }

  // ---------- MODAL VISTA RÁPIDA ----------
  abrirVistaRapida(producto: any): void {
    this.productoSeleccionado = producto;
    this.mostrarResultados = false;
    this.cerrarMenu();
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.productoSeleccionado = null;
    document.body.style.overflow = '';
  }

  comprar(producto: any): void {
    // Aquí llamas a tu CartService, igual que en el Home
    console.log('Comprar:', producto);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.mostrarResultados = false;
    if (this.productoSeleccionado) this.cerrarModal();
  }
}
