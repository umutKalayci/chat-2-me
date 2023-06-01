import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { Person } from './IPerson';
import { ChatService } from '../services/chat/chat.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-disover',
  templateUrl: 'disover.page.html',
  styleUrls: ['disover.page.scss'],
})
export class DiscoverPage implements OnInit {
  items: Person[] = [];
  selectedPerson: Person | undefined;
  @ViewChild('itemCard')
  card!: any;

  @ViewChild('swiper')
  swiperRef!: ElementRef;

  swiper?: Swiper;
  nonSuitable = false;

  matchInfo = {
    isMatch: false,
    roomId: '',
  };
  constructor(private chatService: ChatService, private router: Router) {}
  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data) => {
      this.items = data;
      console.log(this.items);
      this.selectedPerson =
        this.items[Math.floor(Math.random() * this.items.length)];
    });
  }
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // console.log(this.card.el.style);
      console.log(this.items);
      event.target.complete();
      this.cardInAnimation();
    }, 2000);
  }
  like() {
    this.sendRequest();
  }
  async sendRequest() {
    try {
      const room = await this.chatService.sendRequest(this.selectedPerson?.uid);
      // this.card = document.getElementById('itemCard');
      this.card.nativeElement.style.transform = 'translateY(100%) scale(0.5)';
      if (room?.id) {
        //Match
        this.matchInfo.isMatch = true;
        this.matchInfo.roomId = room.id;
      } else this.cardInAnimation();
    } catch (e) {
      console.log(e);
    }
  }
  startChat() {
    this.matchInfo.isMatch = false;
    this.cardInAnimation();
    const navData: NavigationExtras = {
      queryParams: {
        name: this.selectedPerson!.name,
      },
    };
    this.router.navigate(
      ['/', 'pages', 'chats', this.matchInfo.roomId],
      navData
    );
  }

  dislike() {
    this.card.el.style.transform = 'translateX(-110%)';
    this.items.splice(
      this.items.findIndex((o) => {
        return o == this.selectedPerson;
      }),
      1
    );
    this.cardInAnimation();
  }
  cardInAnimation() {
    this.card.el.style.opacity = '0';
    setTimeout(() => {
      this.card.el.setAttribute(
        'style',
        'transform:translateX(110%); transition-duration:0s;'
      );
    }, 300);
    setTimeout(() => {
      this.card.el.setAttribute(
        'style',
        'transform:translateX(0); opacity:1; transition-duration:0.3s;'
      );
      this.selectedPerson =
        this.items[Math.floor(Math.random() * this.items.length)];
      if (this.selectedPerson == undefined) this.nonSuitable = true;
      setTimeout(() => {
        console.log(this.swiper);
        this.swiper?.update();
        this.swiper?.slideTo(0, 0);
      }, 50);
    }, 350);
  }
}
