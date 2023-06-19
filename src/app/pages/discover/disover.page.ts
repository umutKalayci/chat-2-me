import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { Person } from './IPerson';
import { ChatService } from '../../services/chat/chat.service';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SETTINGS, Settings } from '../settings/default-settings';
import { take } from 'rxjs';

@Component({
  selector: 'app-disover',
  templateUrl: 'disover.page.html',
  styleUrls: ['disover.page.scss'],
})
export class DiscoverPage implements OnInit {
  users: Person[] = [];
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
  idsToRemove: string[] = [];
  currentUserId: string;
  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {
    this.currentUserId = this.chatService.getCurrentUserId();
  }
  ngOnInit(): void {
    this.chatService
      .getChatRooms()
      .pipe(take(1))
      .subscribe((chatRooms) => {
        console.log(chatRooms);
        this.idsToRemove = chatRooms.map((chatRoom: any) => {
          return chatRoom.members[0] == this.currentUserId
            ? chatRoom.members[1]
            : chatRoom.members[0];
        });
        console.log(this.idsToRemove);
        console.log(this.users);

        this.loadUser();
      });
  }
  loadUser() {
    this.chatService.getUsers().subscribe((users) => {
      this.users = users.filter(
        (user: { uid: string }) => !this.idsToRemove.includes(user.uid)
      );
      console.log(this.users);
      let settings: Settings;
      this.auth
        .getUserSettings(this.currentUserId)
        .then((userSettings) => (settings = userSettings))
        .catch(() => (settings = SETTINGS))
        .finally(() => {
          this.auth.getUserData(this.currentUserId).then((userInfo) => {
            this.users = this.users.filter((user: any) => {
              user.distance = Number(
                this.calculateDistance(
                  user.lat,
                  user.lng,
                  userInfo.lat,
                  userInfo.lng
                ).toFixed(2)
              );
              return (
                user.age >= settings.ageValue.lower &&
                user.age <= settings.ageValue.upper &&
                (user?.isDiscover == true || user?.isDiscover == undefined) &&
                (user.distance < settings.distanceValue ||
                  settings.distanceValue == 100) &&
                settings.genderValue.includes(user.gender ? 'female' : 'male')
              );
            });
            this.selectedPerson =
              this.users[Math.floor(Math.random() * this.users.length)];
            this.cardInAnimation();
          });
        });
    });
  }
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
      this.loadUser();
    }, 2000);
  }

  async like() {
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
    this.users.splice(
      this.users.findIndex((o) => {
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
        this.users[Math.floor(Math.random() * this.users.length)];
    }, 350);
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
    }, 350);
  }

  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const earthRadius = 6371; // Earth's radius in kilometers
    const dLat = this.degToRad(lat2 - lat1);
    const dLng = this.degToRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) *
        Math.cos(this.degToRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
  }

  degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
