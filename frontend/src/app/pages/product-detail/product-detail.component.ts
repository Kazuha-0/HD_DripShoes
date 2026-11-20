import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);

  producto?: Product;
  productosRecomendados: Product[] = [];
  tallaSeleccionada: string = '';
  errorTalla: boolean = false;
  mostrarGuiaTallas: boolean = false;
  enFavoritos: boolean = false;

  tallas: string[] = ['5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'];

  ngOnInit() {
    // Escucha cambios en el parámetro :id para navegar entre productos recomendados sin recargar
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tallaSeleccionada = '';
        this.errorTalla = false;
        this.cargarProducto(Number(id));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  cargarProducto(id: number) {
    this.productService.getProductos().subscribe({
      next: (productos) => {
        this.producto = productos.find(p => p.id === id);
        if (this.producto) {
          this.generarRecomendaciones(productos, this.producto);
        }
      },
      error: (err) => console.error('Error al cargar detalle:', err)
    });
  }

  generarRecomendaciones(todos: Product[], actual: Product) {
    // Excluir el producto actual y priorizar disponibles (stock > 0 o sin campo stock definido)
    const disponibles = todos.filter(p =>
      p.id !== actual.id && (p.stock === undefined || p.stock > 0)
    );

    // 1. Buscar de la misma categoría o misma marca
    const relacionados = disponibles.filter(p =>
      (actual.categoria && p.categoria?.toLowerCase() === actual.categoria.toLowerCase()) ||
      (actual.marca && p.marca?.toLowerCase() === actual.marca.toLowerCase())
    );

    // 2. Completar hasta 4 tarjetas con otros disponibles si faltan
    const pool = relacionados.length >= 4
      ? relacionados
      : [...relacionados, ...disponibles.filter(p => !relacionados.some(r => r.id === p.id))];

    this.productosRecomendados = pool.slice(0, 4);
  }

  seleccionarTalla(talla: string) {
    this.tallaSeleccionada = talla;
    this.errorTalla = false;
  }

  toggleFavorito() {
    if (!this.producto || this.producto.id === undefined) return;

    if (this.favoritesService.esFavorito(this.producto.id)) {
      this.favoritesService.eliminarFavorito(this.producto.id);
    } else {
      this.favoritesService.agregarFavorito(this.producto);
    }
  }

  esFavorito(): boolean {
    if (!this.producto || this.producto.id === undefined) {
      return false;
    }

    return this.favoritesService.esFavorito(this.producto.id);
  }

  get sinStock(): boolean {
    return this.producto?.stock !== undefined && this.producto.stock <= 0;
  }

  get stockBajo(): boolean {
    return this.producto?.stock !== undefined && this.producto.stock > 0 && this.producto.stock < 5;
  }

  agregarAlCarrito() {
    if (!this.producto || this.sinStock) return;

    if (!this.tallaSeleccionada) {
      this.errorTalla = true;
      return;
    }

    this.cartService.agregarProducto(
      this.producto,
      1,
      this.tallaSeleccionada
    );

    this.cartService.abrirCarrito();
  }
}