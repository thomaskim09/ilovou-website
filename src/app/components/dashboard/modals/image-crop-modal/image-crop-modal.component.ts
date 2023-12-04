import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ImgCropperConfig, ImgCropperEvent } from '@alyle/ui/resizing-cropping-images';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

const styles = (theme: ThemeVariables) => ({
  actions: {
    display: 'flex'
  },
  cropping: {
    borderRadius: '5px',
    width: '100%',
    height: '300px'
  },
  flex: {
    flex: 1
  },
  range: {
    textAlign: 'center',
    maxWidth: '400px'
  },
  rangeInput: {
    maxWidth: '150px',
    margin: '1em 0',

    // http://brennaobrien.com/blog/2014/05/style-input-type-range-in-every-browser.html
    // removes default webkit styles
    '-webkit-appearance': 'none',

    // fix for FF unable to apply focus style bug
    border: `solid 6px ${theme.background.tertiary}`,

    // required for proper track sizing in FF
    width: '100%',
    '&::-webkit-slider-runnable-track': {
      width: '300px',
      height: '3px',
      background: '#ddd',
      border: 'none',
      borderRadius: '1em'
    },
    '&::-webkit-slider-thumb': {
      '-webkit-appearance': 'none',
      border: 'none',
      height: '16px',
      width: '16px',
      borderRadius: '50%',
      background: '#ff9566',
      marginTop: '-6px'
    },
    '&:focus': {
      outline: 'none'
    },
    '&:focus::-webkit-slider-runnable-track': {
      background: '#ccc'
    },

    '&::-moz-range-track': {
      width: '300px',
      height: '3px',
      background: '#ddd',
      border: 'none',
      borderRadius: '1em'
    },
    '&::-moz-range-thumb': {
      border: 'none',
      height: '16px',
      width: '16px',
      borderRadius: '50%',
      background: '#ff9566'
    },

    // hide the outline behind the border
    '&:-moz-focusring': {
      outline: '1px solid white',
      outlineOffset: '-1px',
    },

    '&::-ms-track': {
      width: '300px',
      height: '3px',

      // remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead
      background: 'transparent',

      // leave room for the larger thumb to overflow with a transparent border
      borderColor: 'transparent',
      borderWidth: '6px 0',

      // remove default tick marks
      color: 'transparent'
    },
    '&::-ms-fill-lower': {
      background: '#777',
      borderRadius: '10px'
    },
    '&::-ms-fill-': {
      background: '#ddd',
      borderRadius: '10px',
    },
    '&::-ms-thumb': {
      border: 'none',
      height: '16px',
      width: '16px',
      borderRadius: '50%',
      background: theme.primary.default,
    },
    '&:focus::-ms-fill-lower': {
      background: '#888'
    },
    '&:focus::-ms-fill-upper': {
      background: '#ccc'
    }
  }
});

@Component({
  selector: 'app-image-crop-modal',
  templateUrl: './image-crop-modal.component.html',
  styleUrls: ['./image-crop-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ImageCropModalComponent {

  classes = this.theme.addStyleSheet(styles);
  croppedImage: string;
  result: string;
  scale: number;
  myConfig: ImgCropperConfig = {
    autoCrop: true,
    width: 250, // Default `250`
    height: 250, // Default `200`
    fill: '#ffffff', // Default transparent if type = png else #000,
  };

  constructor(
    public theme: LyTheme2,
    public dialogRef: MatDialogRef<ImageCropModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
  }

  onloaded(e: ImgCropperEvent) {
  }

  onerror(e: ImgCropperEvent) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
