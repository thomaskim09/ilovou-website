import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MRRemarkComponent } from './m-r-remark.component';

describe('MRRemarkComponent', () => {
  let component: MRRemarkComponent;
  let fixture: ComponentFixture<MRRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MRRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MRRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
