import { Component } from '@angular/core';
import { Person } from '../discover/IPerson';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss'],
})
export class ChatsPage {
  constructor() {}
  persons: Person[] = [
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
    {
      name: 'Name 3',
      description: 'Hello guys.',
      images: ['https://ionicframework.com/docs/img/demos/card-media.png'],
    },
  ];
}
