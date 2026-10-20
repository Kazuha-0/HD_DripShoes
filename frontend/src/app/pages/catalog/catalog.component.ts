import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterLink, ActivatedRoute } from '@angular/router'; // <-- Agregamos ActivatedRoute

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
  private route = inject(ActivatedRoute); // <-- Inyectamos la ruta activa
  
  productos: Product[] = [];
  productosFiltrados: Product[] = []; // <-- Arreglo para almacenar el resultado del filtro
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
        // Filtra los productos comparando el campo 'categoria' (insensible a mayúsculas/minúsculas)
        this.productosFiltrados = this.productos.filter(p => 
          p.categoria && p.categoria.toLowerCase() === this.categoriaSeleccionada?.toLowerCase()
        );
      } else {
        // Si entra directamente al catálogo sin filtro en la URL, muestra todos
        this.productosFiltrados = [...this.productos];
      }
    });
  }

  agregarAlCarrito(producto: Product) {
    this.cartService.agregarProducto(producto);
    this.cartService.abrirCarrito();
  }
}