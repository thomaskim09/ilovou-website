import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillLeftComponent } from './bill-left.component';

describe('BillLeftComponent', () => {
  let component: BillLeftComponent;
  let fixture: ComponentFixture<BillLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
