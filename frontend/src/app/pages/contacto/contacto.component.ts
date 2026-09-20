import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  mensajeEnviado: boolean = false;

  validarFormulario(): void {
    this.mensajeEnviado = true;
    alert('¡Gracias por contactarnos! Tu mensaje ha sido enviado con éxito.');
  }

  limpiarFormulario(): void {
    this.mensajeEnviado = false;
  }
}