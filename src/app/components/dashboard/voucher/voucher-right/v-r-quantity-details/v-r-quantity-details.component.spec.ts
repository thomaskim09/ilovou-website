import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRQuantityDetailsComponent } from './v-r-quantity-details.component';

describe('VRQuantityDetailsComponent', () => {
  let component: VRQuantityDetailsComponent;
  let fixture: ComponentFixture<VRQuantityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VRQuantityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRQuantityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
