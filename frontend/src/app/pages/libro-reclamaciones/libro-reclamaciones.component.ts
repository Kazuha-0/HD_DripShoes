import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-libro-reclamaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libro-reclamaciones.component.html',
  styleUrl: './libro-reclamaciones.component.css'
})
export class LibroReclamacionesComponent {
  reclamoEnviado = false;

  enviarReclamo(event: Event): void {
    event.preventDefault();
    this.reclamoEnviado = true;

    setTimeout(() => {
      this.reclamoEnviado = false;
      (event.target as HTMLFormElement).reset();
    }, 4000);
  }
}