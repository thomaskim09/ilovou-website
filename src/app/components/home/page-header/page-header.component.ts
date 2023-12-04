import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})

export class PageHeaderComponent {

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
