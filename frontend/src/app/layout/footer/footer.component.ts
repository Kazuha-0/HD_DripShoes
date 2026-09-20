import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  anio: number = new Date().getFullYear();
  suscrito: boolean = false;
  errorEmail: boolean = false;

  suscribir(email: string): void {
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!valido) {
      this.errorEmail = true;
      return;
    }

    this.errorEmail = false;
    this.suscrito = true;
    console.log('Suscripción al club:', email.trim());
    // Aquí luego llamas a tu backend para guardar el correo
  }
}
