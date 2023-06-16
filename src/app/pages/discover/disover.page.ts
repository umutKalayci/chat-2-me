import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { Person } from './IPerson';
import { ChatService } from '../../services/chat/chat.service';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SETTINGS } from '../settings/default-settings';

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
  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.chatService.getCurrentUserId();
    this.chatService.getUsers().subscribe((data) => {
      this.chatService.getChatRooms();
      let subs = this.chatService.chatRooms.subscribe((res) => {
        let settings: any;
        this.auth
          .getUserSettings(this.chatService.currentUserId)
          .then((userSettings) => {
            settings = userSettings;
          })
          .catch((err) => {
            settings = SETTINGS;
          })
          .finally(() => {
            console.log(settings);
            console.log(data);
            this.auth
              .getUserData(this.chatService.currentUserId)
              .then((userInfo) => {
                this.items = data.filter((d: any) => {
                  return (
                    d.age >= settings.ageValue.lower &&
                    d.age <= settings.ageValue.upper &&
                    this.calculateDistance(
                      d.lat,
                      d.lng,
                      userInfo.lat,
                      userInfo.lng
                    ).toFixed(2) < settings.distanceValue &&
                    (settings.genderValue.length == 2 ||
                      settings.genderValue.length == 0 ||
                      (settings.genderValue[0] == 'male' && !d.gender) ||
                      (settings.genderValue[0] == 'female' && d.gender))
                  );
                });
                let a: string[] = res.map((res1: any) => {
                  return res1.members[0] == this.chatService.currentUserId
                    ? res1.members[1]
                    : res1.members[0];
                });
                console.log(this.items);
                console.log(a);
                a.push(this.chatService.currentUserId);
                this.items = this.items.filter((d: any) => {
                  return !a.includes(d.uid);
                });
                this.selectedPerson =
                  this.items[Math.floor(Math.random() * this.items.length)];
                if (this.selectedPerson?.lat) {
                  this.selectedPerson.distance = this.calculateDistance(
                    this.selectedPerson.lat,
                    this.selectedPerson.lng,
                    userInfo.lat,
                    userInfo.lng
                  ).toFixed(2);
                  console.log(this.selectedPerson.distance);
                }
              });

            this.cardInAnimation();
          });
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
