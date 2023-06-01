import {
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { ChatService } from '../services/chat/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChildren('messageItem') messageItems!: QueryList<any>;

  message: any;
  isLoading = false;
  name: string = '';
  chatId: string = '';
  chats!: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const userInfo: any = this.route.snapshot.queryParams;
    if (userInfo?.name) {
      this.name = userInfo.name;
    }
    if (this.route.snapshot.paramMap.get('id')) {
      this.chatId = this.route.snapshot.paramMap.get('id') || '';
      this.chatService.getChatRoomMessages(this.chatId);
      console.log(this.chats);
      // setTimeout(() => {
      this.chats = this.chatService.selectedChatRoomMessages;
      console.log(this.chats);
      // }, 3000);
    } else {
      this.navCtrl.back();
      return;
    }
  }

  ngAfterViewInit() {
    this.messageItems.changes.subscribe(() => {
      this.cdr.detectChanges();
      setTimeout(() => {
        this.scrollToBottom();
      }, 200);
    });
  }

  async sendMessage() {
    if (!this.message || this.message?.trim() == '') return;
    try {
      this.isLoading = true;
      await this.chatService.sendMessage(this.chatId, this.message);
      this.message = '';
      this.isLoading = false;
      this.scrollToBottom();
    } catch (e) {
      this.isLoading = false;
      console.log(e);
    }
  }
  scrollToBottom() {
    if (this.chats) this.content.scrollToBottom(200);
  }

  trackByIdentify(index: number, item: any) {
    return item.message;
  }
}
