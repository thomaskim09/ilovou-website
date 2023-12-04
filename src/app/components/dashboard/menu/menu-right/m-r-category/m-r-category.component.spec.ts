import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MRCategoryComponent } from './m-r-category.component';

describe('MRCategoryComponent', () => {
  let component: MRCategoryComponent;
  let fixture: ComponentFixture<MRCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MRCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MRCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
