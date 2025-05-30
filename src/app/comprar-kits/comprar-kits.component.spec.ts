import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprarKitsComponent } from './comprar-kits.component';

describe('ComprarKitsComponent', () => {
  let component: ComprarKitsComponent;
  let fixture: ComponentFixture<ComprarKitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprarKitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprarKitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
