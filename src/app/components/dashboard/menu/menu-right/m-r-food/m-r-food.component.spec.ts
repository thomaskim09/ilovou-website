import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MRFoodComponent } from './m-r-food.component';

describe('MRFoodComponent', () => {
  let component: MRFoodComponent;
  let fixture: ComponentFixture<MRFoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MRFoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MRFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
