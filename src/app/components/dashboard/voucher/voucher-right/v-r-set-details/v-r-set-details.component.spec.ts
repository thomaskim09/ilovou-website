import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRSetDetailsComponent } from './v-r-set-details.component';

describe('SetDetailsComponent', () => {
  let component: VRSetDetailsComponent;
  let fixture: ComponentFixture<VRSetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VRSetDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRSetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
