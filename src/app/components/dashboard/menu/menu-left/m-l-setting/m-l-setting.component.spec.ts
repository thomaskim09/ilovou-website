import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MLSettingComponent } from './m-l-setting.component';

describe('MLSettingComponent', () => {
  let component: MLSettingComponent;
  let fixture: ComponentFixture<MLSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MLSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MLSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
