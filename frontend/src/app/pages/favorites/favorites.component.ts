import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {

  private favoritesService = inject(FavoritesService);

  favoritos: Product[] = [];

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.favoritos = this.favoritesService.obtenerFavoritos();
  }

  eliminarFavorito(id: number): void {
    this.favoritesService.eliminarFavorito(id);
    this.cargarFavoritos();
  }
}