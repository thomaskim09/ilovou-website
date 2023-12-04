import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MLRemarkComponent } from './m-l-remark.component';

describe('MLRemarkComponent', () => {
  let component: MLRemarkComponent;
  let fixture: ComponentFixture<MLRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MLRemarkComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MLRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
