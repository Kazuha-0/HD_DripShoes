
import { Injectable } from '@angular/core';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private readonly STORAGE_KEY = 'dripshoes_favorites';

  obtenerFavoritos(): Product[] {
    try {
      const datos = localStorage.getItem(this.STORAGE_KEY);
      return datos ? JSON.parse(datos) : [];
    } catch {
      return [];
    }
  }

  agregarFavorito(producto: Product): void {
    if (producto.id === undefined) return;

    const favoritos = this.obtenerFavoritos();

    const existe = favoritos.some(
      favorito => favorito.id === producto.id
    );

    if (!existe) {
      favoritos.push(producto);
      this.guardar(favoritos);
    }
  }

  eliminarFavorito(id: number): void {
    const favoritos = this.obtenerFavoritos()
      .filter(producto => producto.id !== id);

    this.guardar(favoritos);
  }

  esFavorito(id: number): boolean {
    return this.obtenerFavoritos()
      .some(producto => producto.id === id);
  }

  private guardar(favoritos: Product[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(favoritos)
    );
  }
}
