import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropModalComponent } from './image-crop-modal.component';

describe('ImageCropperModalComponent', () => {
  let component: ImageCropModalComponent;
  let fixture: ComponentFixture<ImageCropModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageCropModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
