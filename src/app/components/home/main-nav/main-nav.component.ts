import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})

export class MainNavComponent {

  constructor() { }

  scroll(id) {
    // jQuery for page scrolling feature - requires jQuery Easing plugin
    const element = $(id).offset();
    if (element) {
      $('html, body').stop().animate({
        scrollTop: (element.top - 50)
      }, 1250, 'easeInOutExpo');
    }
  }
}
