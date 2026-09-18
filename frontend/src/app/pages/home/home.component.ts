import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  HostListener,
} from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule], // <-- 2. Añádelo a los imports
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  productos: Product[] = [];
  mostrarBotonScroll: boolean = false;

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
  // Escucha el evento de desplazamiento de la ventana
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Muestra el botón cuando el usuario desplaza más de 300px hacia abajo
    this.mostrarBotonScroll = window.scrollY > 300;
  }

  // Función para volver al inicio suavemente
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  comprar(producto: any): void {
    // Aquí llamas a tu servicio del carrito, por ejemplo:
    // this.cartService.agregar(producto);
    console.log('Comprar:', producto);
  }
}
