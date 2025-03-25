import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearkitComponent } from './crearkit.component';

describe('CrearkitComponent', () => {
  let component: CrearkitComponent;
  let fixture: ComponentFixture<CrearkitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearkitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
