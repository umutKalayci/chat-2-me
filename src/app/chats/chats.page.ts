import { Component } from '@angular/core';
import { Person } from '../discover/IPerson';
import { ChatService } from '../services/chat/chat.service';
import { Observable, take } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss'],
})
export class ChatsPage {
  chatRooms!: Observable<any[]>;

  constructor(private chatService: ChatService, private router: Router) {
    this.getChats();
  }
  getChats() {
    this.chatService.getChatRooms();
    this.chatRooms = this.chatService.chatRooms;
  }
  getUser(user: any) {
    return user;
  }
  getChat(chat: any) {
    (chat?.user).pipe(take(1)).subscribe((user_data: any) => {
      console.log('data: ', user_data);
      const navData: NavigationExtras = {
        queryParams: {
          name: user_data?.name,
        },
      };
      this.router.navigate(['/', 'pages', 'chats', chat?.id], navData);
    });
  }
}
