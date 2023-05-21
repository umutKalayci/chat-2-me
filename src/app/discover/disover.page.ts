import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { Person } from './IPerson';

@Component({
  selector: 'app-disover',
  templateUrl: 'disover.page.html',
  styleUrls: ['disover.page.scss'],
})
export class DiscoverPage implements OnInit {
  items: Person[] = [
    {
      name: 'Name 1',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, temporibus.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, temporibus.',
      images: [
        'https://ionicframework.com/docs/img/demos/card-media.png',
        'https://ionicframework.com/docs/img/demos/card-media.png',
        'https://ionicframework.com/docs/img/demos/card-media.png',
      ],
    },
    {
      name: 'Name 2',
      description: 'Hello guys.',
      images: [
        'https://ionicframework.com/docs/img/demos/card-media.png',
        'https://ionicframework.com/docs/img/demos/card-media.png',
      ],
    },
    {
      name: 'Name 3',
      description: 'Hello guys.',
      images: ['https://ionicframework.com/docs/img/demos/card-media.png'],
    },
  ];
  selectedPerson: Person;
  card: any;
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  constructor() {
    this.selectedPerson = this.items[0];
  }
  ngOnInit(): void {
    this.card = document.getElementById('itemCard');
  }
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
      this.cardInAnimation();
    }, 2000);
  }
  like() {
    this.card.style.transform = 'translateY(100%) scale(0.5)';
    this.cardInAnimation();
  }
  dislike() {
    this.card.style.transform = 'translateX(-110%)';
    this.cardInAnimation();
  }
  cardInAnimation() {
    this.card.style.opacity = '0';
    setTimeout(() => {
      this.card.setAttribute(
        'style',
        'transform:translateX(110%); transition-duration:0s;'
      );
    }, 300);
    setTimeout(() => {
      this.card.setAttribute(
        'style',
        'transform:translateX(0); opacity:1; transition-duration:0.3s;'
      );
      this.selectedPerson =
        this.items[Math.floor(Math.random() * this.items.length)];
      setTimeout(() => {
        this.swiper?.update();
        this.swiper?.slideTo(0, 0);
      }, 50);
    }, 350);
  }
}
