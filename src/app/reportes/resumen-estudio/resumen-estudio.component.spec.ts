import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenEstudioComponent } from './resumen-estudio.component';

describe('ResumenEstudioComponent', () => {
  let component: ResumenEstudioComponent;
  let fixture: ComponentFixture<ResumenEstudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenEstudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
