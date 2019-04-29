import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortDirectionComponent } from './sort-direction.component';

describe('SortDirectionComponent', () => {
  let component: SortDirectionComponent;
  let fixture: ComponentFixture<SortDirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortDirectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
