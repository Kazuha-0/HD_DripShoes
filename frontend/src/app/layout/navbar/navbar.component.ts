import { Component, HostListener, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';
import { RouterLink, RouterLinkActive } from '@angular/router'
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);

  menuAbierto: boolean = false;
  mostrarLoginModal: boolean = false;
  modoAuth: 'login' | 'registro' = 'login';
  mensajeError: string = '';

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

  // ---------- MENÚ ----------
  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  // ---------- LOGIN / REGISTRO ----------
  get usuarioActual() {
    return this.authService.getUsuario();
  }

  get estaLogueado(): boolean {
    return this.authService.estaAutenticado();
  }

  abrirLoginModal(): void {
    this.mostrarLoginModal = true;
    this.mensajeError = '';
    this.cerrarMenu();
  }

  cerrarLoginModal(): void {
    this.mostrarLoginModal = false;
    this.mensajeError = '';
  }

  iniciarSesion(email: string, password: string): void {
    this.mensajeError = '';
    this.authService.login({ email, password }).subscribe({
      next: () => this.cerrarLoginModal(),
      error: (err) => {
        this.mensajeError = err.error || 'Correo o contraseña incorrectos';
      },
    });
  }

  registrarse(): void {
    this.mensajeError = '';
    this.authService.registrar(this.registro).subscribe({
      next: () => {
        this.modoAuth = 'login';
        this.registro = {
          nombre: '',
          apellido: '',
          celular: '',
          email: '',
          password: '',
        };
      },
      error: (err) => {
        this.mensajeError = err.error || 'No se pudo completar el registro';
      },
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  // ---------- BÚSQUEDA ----------
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
      .slice(0, 6);

    this.mostrarResultados = true;
  }

  abrirPrimerResultado(): void {
    this.filtrar();
    if (this.resultados.length > 0) {
      this.abrirVistaRapida(this.resultados[0]);
    }
  }

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
