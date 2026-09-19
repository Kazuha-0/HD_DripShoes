import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  HostListener,
} from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  productos: Product[] = [];
  mostrarBotonScroll: boolean = false;
  productoSeleccionado: any = null;

  // Lógica del Carrusel
  slides: string[] = [
    'assets/img_inicio/slide1.jpg',
    'assets/img_inicio/slide2.jpg',
    'assets/img_inicio/slide3.jpg',
    'assets/img_inicio/slide4.jpg',
  ];
  currentSlide = 0;
  slideInterval: any;

  ngOnInit() {
    this.productService.getProductos().subscribe({
      next: (data) => (this.productos = data),
      error: (err) => console.error('Error al cargar BD:', err),
    });

    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 4000);
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // Muestra el botón "volver arriba" al bajar más de 300px
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.mostrarBotonScroll = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- MODAL VISTA RÁPIDA ----------
  abrirVistaRapida(producto: any): void {
    this.productoSeleccionado = producto;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.productoSeleccionado = null;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.productoSeleccionado) this.cerrarModal();
  }

  // ---------- CARRITO ----------
  comprar(producto: any): void {
    this.cartService.agregarProducto(producto);
    this.cartService.abrirCarrito();
  }
}
