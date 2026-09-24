import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  
  productos: Product[] = [];

  ngOnInit() {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
      }
    });
  }

  // Método para agregar el producto al carrito y desplegar el panel
  agregarAlCarrito(producto: Product) {
    this.cartService.agregarProducto(producto);
    this.cartService.abrirCarrito();
  }
}