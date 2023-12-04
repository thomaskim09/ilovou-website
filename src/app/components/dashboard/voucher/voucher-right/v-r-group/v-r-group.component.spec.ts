import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRGroupComponent } from './v-r-group.component';

describe('VRGroupComponent', () => {
  let component: VRGroupComponent;
  let fixture: ComponentFixture<VRGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VRGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
