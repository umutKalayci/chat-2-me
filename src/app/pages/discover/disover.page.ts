import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { Person } from './IPerson';
import { ChatService } from '../../services/chat/chat.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-disover',
  templateUrl: 'disover.page.html',
  styleUrls: ['disover.page.scss'],
})
export class DiscoverPage implements OnInit {
  items: Person[] = [];
  _selectedPerson: Person | undefined;
  get selectedPerson() {
    return this._selectedPerson;
  }
  set selectedPerson(value: any) {
    this._selectedPerson = value;
    setTimeout(() => {
      this.swiper?.update();
      this.swiper?.slideTo(0, 0);
    }, 50);
    if (value == undefined) this.nonSuitable = true;
  }

  @ViewChild('itemCard')
  card!: any;

  @ViewChild('swiper')
  swiperRef!: ElementRef;

  swiper?: Swiper;
  nonSuitable = false;

  matchInfo = {
    isMatch: false,
    roomId: '',
    name: '',
  };
  constructor(private chatService: ChatService, private router: Router) {}
  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data) => {
      this.chatService.getChatRooms();
      let subs = this.chatService.chatRooms.subscribe((res) => {
        let a: string[] = res.map((res1: any) => {
          return res1.members[0] == this.chatService.currentUserId
            ? res1.members[1]
            : res1.members[0];
        });
        this.items = data.filter((d: any) => {
          return !a.includes(d.uid);
        });
        console.log('hi');
        this.selectedPerson =
          this.items[Math.floor(Math.random() * this.items.length)];
        this.cardInAnimation();
      });
      setTimeout(() => {
        subs.unsubscribe();
      }, 1000);
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
      this.selectRandomPerson();
    }, 2000);
  }
  like() {
    this.sendRequest();
  }
  async sendRequest() {
    try {
      this.card.el.style.transform = 'translateY(100%) scale(0.5)';
      const room = await this.chatService.sendRequest(this.selectedPerson?.uid);
      if (room?.id) {
        //Match
        this.matchInfo.isMatch = true;
        this.matchInfo.roomId = room.id;
        this.matchInfo.name = this.selectedPerson.name;
      }
      this.removePerson(this.selectedPerson);
      this.selectRandomPerson();
    } catch (e) {
      console.log(e);
    }
  }
  startChat() {
    this.matchInfo.isMatch = false;
    const navData: NavigationExtras = {
      queryParams: {
        name: this.matchInfo.name,
      },
    };
    this.router.navigate(
      ['/', 'pages', 'chats', this.matchInfo.roomId],
      navData
    );
  }
  removePerson(person: any) {
    this.items.splice(
      this.items.findIndex((o) => {
        return o == person;
      }),
      1
    );
  }
  dislike() {
    this.card.el.style.transform = 'translateX(-110%)';
    this.removePerson(this.selectedPerson);
    this.selectRandomPerson();
  }
  selectRandomPerson() {
    setTimeout(() => {
      this.selectedPerson =
        this.items[Math.floor(Math.random() * this.items.length)];
    }, 350);
    this.cardInAnimation();
  }
  cardInAnimation() {
    console.log('log');
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
    }, 350);
  }
}
