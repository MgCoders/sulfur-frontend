import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaPrecioCargoComponent } from './alta-precio-cargo.component';

describe('AltaPrecioCargoComponent', () => {
  let component: AltaPrecioCargoComponent;
  let fixture: ComponentFixture<AltaPrecioCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaPrecioCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaPrecioCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
