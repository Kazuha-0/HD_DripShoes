import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  pregunta: string;
  respuesta: string;
  abierto: boolean;
}

@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrl: './preguntas-frecuentes.component.css'
})
export class PreguntasFrecuentesComponent {
  mensajeEnviado = false;

  faqs: FaqItem[] = [
    {
      pregunta: '¿Cuáles son los métodos de pago aceptados?',
      respuesta: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard), Yape, Plin y transferencias bancarias directas.',
      abierto: true
    },
    {
      pregunta: '¿Cuánto tiempo tarda en llegar mi pedido?',
      respuesta: 'Los envíos dentro de Lima metropolitana toman de 24 a 48 horas hábiles. Para provincias, el tiempo estimado es de 3 a 5 días hábiles.',
      abierto: false
    },
    {
      pregunta: '¿Los productos son 100% originales?',
      respuesta: 'Sí, en DripShoes garantizamos la autenticidad de todo nuestro catálogo de calzado y accesorios.',
      abierto: false
    },
    {
      pregunta: '¿Puedo solicitar un cambio o devolución?',
      respuesta: 'Sí, dispones de hasta 7 días calendario posterior a la recepción del producto para solicitar un cambio. Consulta nuestra sección de Cambios y Devoluciones para más detalle.',
      abierto: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].abierto = !this.faqs[index].abierto;
  }

  enviarConsulta(event: Event): void {
    event.preventDefault();
    this.mensajeEnviado = true;

    // Resetear la alerta de éxito después de 4 segundos
    setTimeout(() => {
      this.mensajeEnviado = false;
      (event.target as HTMLFormElement).reset();
    }, 4000);
  }
}