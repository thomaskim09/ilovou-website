import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationLeftComponent } from './reservation-left.component';

describe('ReservationLeftComponent', () => {
  let component: ReservationLeftComponent;
  let fixture: ComponentFixture<ReservationLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
