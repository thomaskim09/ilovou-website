import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MLFoodComponent } from './m-l-food.component';

describe('MLFoodComponent', () => {
  let component: MLFoodComponent;
  let fixture: ComponentFixture<MLFoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MLFoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MLFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
