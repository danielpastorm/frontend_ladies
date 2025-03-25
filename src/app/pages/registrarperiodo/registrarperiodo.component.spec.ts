import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarperiodoComponent } from './registrarperiodo.component';

describe('RegistrarperiodoComponent', () => {
  let component: RegistrarperiodoComponent;
  let fixture: ComponentFixture<RegistrarperiodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarperiodoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarperiodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
