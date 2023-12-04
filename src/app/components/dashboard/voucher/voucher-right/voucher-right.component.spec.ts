import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherRightComponent } from './voucher-right.component';

describe('VoucherRightComponent', () => {
  let component: VoucherRightComponent;
  let fixture: ComponentFixture<VoucherRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
