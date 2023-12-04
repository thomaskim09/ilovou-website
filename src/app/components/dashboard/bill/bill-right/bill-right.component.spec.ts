import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillRightComponent } from './bill-right.component';

describe('BillRightComponent', () => {
  let component: BillRightComponent;
  let fixture: ComponentFixture<BillRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
