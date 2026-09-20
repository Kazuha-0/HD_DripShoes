import { Component, HostListener, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);

  menuAbierto: boolean = false;
  mostrarLoginModal: boolean = false;
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

  // ---------- CARRITO (estado en CartService) ----------
  get totalItemsCart(): number {
    return this.cartService.TotalItems;
  }

  get mostrarCarritoModal(): boolean {
    return this.cartService.carritoAbierto;
  }

  get items() {
    return this.cartService.items;
  }

  get totalPrecio(): number {
    return this.cartService.TotalPrecio;
  }

  toggleCarritoModal(): void {
    this.cartService.toggleCarrito();
    this.cerrarMenu();
  }

  cerrarCarritoModal(): void {
    this.cartService.cerrarCarrito();
  }

  aumentar(producto: any): void {
    this.cartService.agregarProducto(producto);
  }

  disminuir(id: any): void {
    this.cartService.disminuirProducto(id);
  }

  quitar(id: any): void {
    this.cartService.quitarProducto(id);
  }

  comprar(producto: any): void {
    this.cartService.agregarProducto(producto);
    this.cartService.abrirCarrito();
  }

  // ---------- MENÚ Y LOGIN ----------
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

  // ---------- BÚSQUEDA ----------
  // Quita tildes y pasa a minúsculas
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

  // Enter o clic en la lupa: abre el primer resultado
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

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.mostrarResultados = false;
    if (this.productoSeleccionado) this.cerrarModal();
  }
}
