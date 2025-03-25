import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarkitsComponent } from './editarkits.component';

describe('EditarkitsComponent', () => {
  let component: EditarkitsComponent;
  let fixture: ComponentFixture<EditarkitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarkitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarkitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
