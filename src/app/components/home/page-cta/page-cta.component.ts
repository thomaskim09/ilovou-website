import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-page-cta',
  templateUrl: './page-cta.component.html',
  styleUrls: ['./page-cta.component.scss']
})

export class PageCtaComponent {

  ticketList = [
    {
      voucherName: '2 Person Nasi Lemak Set',
      restaurantName: 'Restaurant ILO',
      voucherImage: '../../../../assets/home-style/img/nasi-lemak.jpg',
      newPrice: 8.9,
      basePrice: 12
    },
    {
      voucherName: '10 x Kopi O',
      restaurantName: 'Restaurant VOU',
      voucherImage: '../../../../assets/home-style/img/kopi-o.jpg',
      newPrice: 20,
      basePrice: 24
    },
    {
      voucherName: 'RM10 Cash Voucher',
      restaurantName: 'Restaurant CHY',
      voucherImage: '../../../../assets/home-style/img/cash-voucher.jpg',
      newPrice: 5,
      basePrice: 10
    }
  ];

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
