import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoConfiguracionesComponent } from './mantenimiento-configuraciones.component';

describe('MantenimientoConfiguracionesComponent', () => {
  let component: MantenimientoConfiguracionesComponent;
  let fixture: ComponentFixture<MantenimientoConfiguracionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoConfiguracionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoConfiguracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
