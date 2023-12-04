import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRLimitComponent } from './v-r-limit.component';

describe('VRLimitComponent', () => {
  let component: VRLimitComponent;
  let fixture: ComponentFixture<VRLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VRLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
