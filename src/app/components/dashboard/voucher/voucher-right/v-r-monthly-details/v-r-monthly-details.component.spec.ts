import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRMonthlyDetailsComponent } from './v-r-monthly-details.component';

describe('VRMonthlyDetailsComponent', () => {
  let component: VRMonthlyDetailsComponent;
  let fixture: ComponentFixture<VRMonthlyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VRMonthlyDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRMonthlyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
