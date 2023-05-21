import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../discover/IPerson';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  person: Person = {
    id: 1,
    name: 'Name 1',
    description:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, temporibus.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, temporibus.',
    images: [
      'https://ionicframework.com/docs/img/demos/card-media.png',
      'https://ionicframework.com/docs/img/demos/card-media.png',
      'https://ionicframework.com/docs/img/demos/card-media.png',
    ],
  };
  name: string = 'Sender';
  message: any;
  isLoading = false;
  currentUserId = 1;
  chats = [
    { id: 1, sender: 1, message: 'hi' },
    { id: 2, sender: 2, message: 'hi there!' },
  ];

  constructor(private route: ActivatedRoute) {
    console.log(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {}

  sendMessage() {
    this.chats.push({
      id: this.chats.length + 1,
      sender: 1,
      message: this.message,
    });
  }
}
