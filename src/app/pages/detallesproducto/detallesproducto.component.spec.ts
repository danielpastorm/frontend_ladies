import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesproductoComponent } from './detallesproducto.component';

describe('DetallesproductoComponent', () => {
  let component: DetallesproductoComponent;
  let fixture: ComponentFixture<DetallesproductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesproductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
