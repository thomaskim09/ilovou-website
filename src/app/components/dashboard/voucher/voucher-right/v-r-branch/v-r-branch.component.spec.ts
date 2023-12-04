import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRBranchComponent } from './v-r-branch.component';

describe('VRBranchComponent', () => {
  let component: VRBranchComponent;
  let fixture: ComponentFixture<VRBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VRBranchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
