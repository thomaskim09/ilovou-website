import { Component } from '@angular/core';

@Component({
  selector: 'app-page-features',
  templateUrl: './page-features.component.html',
  styleUrls: ['./page-features.component.scss']
})

export class PageFeaturesComponent {

  height: string = '558px';
  imageSources: string[] = [
    'assets/home-style/img/page1.png',
    'assets/home-style/img/page2.png',
    'assets/home-style/img/page3.png',
    'assets/home-style/img/page4.png',
  ];

}
