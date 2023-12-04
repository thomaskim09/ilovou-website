import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherLeftComponent } from './voucher-left.component';

describe('VoucherLeftComponent', () => {
  let component: VoucherLeftComponent;
  let fixture: ComponentFixture<VoucherLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
