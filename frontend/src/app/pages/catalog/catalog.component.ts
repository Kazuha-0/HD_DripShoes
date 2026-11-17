import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  productos: Product[] = [];
  productosFiltrados: Product[] = [];
  marcasDisponibles: string[] = [];

  categoriaSeleccionada: string | null = null;
  marcaSeleccionada: string = '';
  ordenPrecio: string = 'default';

  ngOnInit() {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.extraerMarcas();
        this.escucharParametrosBusqueda();
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
      }
    });
  }

  extraerMarcas() {
    const marcasUnicas = new Set(
      this.productos
        .map(p => p.marca?.trim())
        .filter((marca): marca is string => Boolean(marca))
    );
    this.marcasDisponibles = Array.from(marcasUnicas).sort();
  }

  escucharParametrosBusqueda() {
    this.route.queryParams.subscribe(params => {
      this.categoriaSeleccionada = params['categoria'] || null;
      this.aplicarFiltrosYOrden();
    });
  }

  aplicarFiltrosYOrden() {
    let resultado = [...this.productos];

    // 1. Filtrar por categoría (si viene por queryParam)
    if (this.categoriaSeleccionada) {
      resultado = resultado.filter(p =>
        p.categoria && p.categoria.toLowerCase() === this.categoriaSeleccionada?.toLowerCase()
      );
    }

    // 2. Filtrar por marca seleccionada
    if (this.marcaSeleccionada) {
      resultado = resultado.filter(p =>
        p.marca && p.marca.toLowerCase() === this.marcaSeleccionada.toLowerCase()
      );
    }

    // 3. Ordenar por precio
    if (this.ordenPrecio === 'asc') {
      resultado.sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (this.ordenPrecio === 'desc') {
      resultado.sort((a, b) => Number(b.precio) - Number(a.precio));
    }

    this.productosFiltrados = resultado;
  }

  limpiarFiltros() {
    this.marcaSeleccionada = '';
    this.ordenPrecio = 'default';
    if (this.categoriaSeleccionada) {
      this.router.navigate([], { queryParams: { categoria: null }, queryParamsHandling: 'merge' });
    } else {
      this.aplicarFiltrosYOrden();
    }
  }

  get hayFiltrosActivos(): boolean {
    return Boolean(this.categoriaSeleccionada || this.marcaSeleccionada || this.ordenPrecio !== 'default');
  }

  agregarAlCarrito(producto: Product) {
    this.cartService.agregarProducto(producto);
    this.cartService.abrirCarrito();
  }
}