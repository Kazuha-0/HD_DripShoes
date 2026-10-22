import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cambios-devoluciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cambios-devoluciones.component.html',
  styleUrl: './cambios-devoluciones.component.css'
})
export class CambiosDevolucionesComponent {
  pasosCambio = [
    {
      numero: '01',
      titulo: 'Verifica los Requisitos',
      descripcion: 'Asegúrate de estar dentro de los 7 días calendario posteriores a tu compra y que el calzado no tenga señales de uso.'
    },
    {
      numero: '02',
      titulo: 'Prepara tu Comprobante',
      descripcion: 'Ten a la mano tu número de pedido y la boleta/factura digital que recibiste por correo.'
    },
    {
      numero: '03',
      titulo: 'Contáctanos',
      descripcion: 'Escríbenos a soporte@dripshoes.com o por WhatsApp indicando el motivo del cambio y la nueva talla deseada.'
    },
    {
      numero: '04',
      titulo: 'Envío de Producto',
      descripcion: 'Envía el producto a nuestro almacén central. Una vez inspeccionado, despachamos tu nuevo pedido inmediatamente.'
    }
  ];
}