import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarCategoriaMarcaComponent } from './administrar-categoria-marca.component';

describe('AdministrarCategoriaMarcaComponent', () => {
  let component: AdministrarCategoriaMarcaComponent;
  let fixture: ComponentFixture<AdministrarCategoriaMarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarCategoriaMarcaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarCategoriaMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
