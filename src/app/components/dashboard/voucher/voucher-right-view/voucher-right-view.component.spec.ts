import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherRightViewComponent } from './voucher-right-view.component';

describe('VoucherRightViewComponent', () => {
  let component: VoucherRightViewComponent;
  let fixture: ComponentFixture<VoucherRightViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherRightViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherRightViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
