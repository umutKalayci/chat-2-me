import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { Person } from './IPerson';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-disover',
  templateUrl: 'disover.page.html',
  styleUrls: ['disover.page.scss'],
})
export class DiscoverPage implements OnInit {
  // items: Person[] = [
  //   {
  //     uid: '1',
  //     name: 'Name 1',
  //     email: 'a@gmail.com',
  //     description:
  //       'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, temporibus.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, temporibus.',
  //     images: [
  //       'https://ionicframework.com/docs/img/demos/card-media.png',
  //       'https://ionicframework.com/docs/img/demos/card-media.png',
  //       'https://ionicframework.com/docs/img/demos/card-media.png',
  //     ],
  //   },
  //   {
  //     uid: '2',
  //     email: 'a@gmail.com',
  //     name: 'Name 2',
  //     description: 'Hello guys.',
  //     images: [
  //       'https://ionicframework.com/docs/img/demos/card-media.png',
  //       'https://ionicframework.com/docs/img/demos/card-media.png',
  //     ],
  //   },
  //   {
  //     uid: '3',
  //     email: 'a@gmail.com',
  //     name: 'Name 3',
  //     description: 'Hello guys.',
  //     images: ['https://ionicframework.com/docs/img/demos/card-media.png'],
  //   },
  // ];
  items: Person[] = [];
  selectedPerson: Person | undefined;
  card: any;
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  nonSuitable = false;

  constructor(private chatService: ChatService) {}
  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data) => {
      this.items = data;
      this.selectedPerson = this.items[0];
    });
  }
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
      this.selectedPerson =
        this.items[Math.floor(Math.random() * this.items.length)];
    }, 2000);
  }
  like() {
    this.card = document.getElementById('itemCard');
    this.card.style.transform = 'translateY(100%) scale(0.5)';
    this.cardInAnimation();
  }
  dislike() {
    this.card = document.getElementById('itemCard');
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
      this.items.splice(
        this.items.findIndex((o) => {
          return o == this.selectedPerson;
        }),
        1
      );
      this.selectedPerson =
        this.items[Math.floor(Math.random() * this.items.length)];
      if (this.selectedPerson == undefined) this.nonSuitable = true;
      setTimeout(() => {
        this.swiper?.update();
        this.swiper?.slideTo(0, 0);
      }, 50);
    }, 350);
  }
}
