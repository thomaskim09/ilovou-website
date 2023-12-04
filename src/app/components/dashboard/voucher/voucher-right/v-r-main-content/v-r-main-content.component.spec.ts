import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRMainContentComponent } from './v-r-main-content.component';

describe('MainContentComponent', () => {
  let component: VRMainContentComponent;
  let fixture: ComponentFixture<VRMainContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VRMainContentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRMainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
