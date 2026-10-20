import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterLink, ActivatedRoute } from '@angular/router';

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
  private route = inject(ActivatedRoute);
  
  productos: Product[] = [];
  productosFiltrados: Product[] = [];
  categoriaSeleccionada: string | null = null;

  ngOnInit() {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.escucharParametrosBusqueda();
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
      }
    });
  }

  escucharParametrosBusqueda() {
    this.route.queryParams.subscribe(params => {
      this.categoriaSeleccionada = params['categoria'] || null;

      if (this.categoriaSeleccionada) {
        this.productosFiltrados = this.productos.filter(p => 
          p.categoria && p.categoria.toLowerCase() === this.categoriaSeleccionada?.toLowerCase()
        );
      } else {
        this.productosFiltrados = [...this.productos];
      }
    });
  }

  agregarAlCarrito(producto: Product) {
    this.cartService.agregarProducto(producto);
    this.cartService.abrirCarrito();
  }
}