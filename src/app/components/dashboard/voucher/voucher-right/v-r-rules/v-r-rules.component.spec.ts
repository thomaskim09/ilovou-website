import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRRulesComponent } from './v-r-rules.component';

describe('VRRulesComponent', () => {
  let component: VRRulesComponent;
  let fixture: ComponentFixture<VRRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VRRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
