import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

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

  producto?: Product;
  tallaSeleccionada: string = '';
  tallas: string[] = ['5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(Number(id));
    }
  }

  cargarProducto(id: number) {
    this.productService.getProductos().subscribe({
      next: (productos) => {
        this.producto = productos.find(p => p.id === id);
      },
      error: (err) => console.error('Error al cargar detalle:', err)
    });
  }

  seleccionarTalla(talla: string) {
    this.tallaSeleccionada = talla;
  }
}