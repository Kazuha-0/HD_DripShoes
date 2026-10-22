import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiosDevolucionesComponent } from './cambios-devoluciones.component';

describe('CambiosDevolucionesComponent', () => {
  let component: CambiosDevolucionesComponent;
  let fixture: ComponentFixture<CambiosDevolucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiosDevolucionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CambiosDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
