import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentUserId!: string;
  public users!: Observable<any>;
  public chatRooms!: Observable<any>;
  public selectedChatRoomMessages!: Observable<any>;

  constructor(public auth: AuthService, private api: ApiService) {
    this.currentUserId = this.auth.getId();
  }

  getUsers() {
    this.users = this.api.collectionDataQuery(
      'users',
      this.api.whereQuery('uid', '!=', this.currentUserId)
    );
    return this.users;
  }

  async sendRequest(receiverId: any) {
    try {
      const datas = (
        await this.api.getDocsWithMultiQuery('relationRequests', [
          this.api.whereQuery('sender', '==', receiverId),
          this.api.whereQuery('receiver', '==', this.currentUserId),
        ])
      ).docs.map((doc: any) => {
        let data = doc.data();
        data.id = doc.id;
        return data;
      });
      if (datas.length > 0) {
        console.log('Match!');
        for (let i = 0; i < datas.length; i++) {
          console.log(datas[i].id);
          this.api.deleteDocument('relationRequests', datas[i].id);
        }
        return this.createChatRoom(receiverId);
      } else {
        console.log('Send Request');
        const add = await this.api.addDocument('relationRequests', {
          sender: this.currentUserId,
          receiver: receiverId,
        });
        console.log(add.id);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createChatRoom(user_id: any) {
    try {
      let room: any;
      const querySnapshot = await this.api.getDocs(
        'chatRooms',
        this.api.whereQuery('members', 'in', [
          [user_id, this.currentUserId],
          [this.currentUserId, user_id],
        ])
      );
      room = await querySnapshot.docs.map((doc: any) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });
      if (room?.length > 0) return room[0];
      const data = {
        members: [this.currentUserId, user_id],
        type: 'private',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      room = await this.api.addDocument('chatRooms', data);
      return room;
    } catch (e) {
      throw e;
    }
  }

  getChatRooms() {
    // this.currentUserId = this.auth.getId();
    // console.log(this.currentUserId);
    this.chatRooms = this.api
      .collectionDataQuery(
        'chatRooms',
        this.api.whereQuery('members', 'array-contains', this.currentUserId)
      )
      .pipe(
        map((data: any[]) => {
          // console.log('room data: ', data);
          data.map((element) => {
            const user_data = element.members.filter(
              (x: string) => x != this.currentUserId
            );
            // console.log(user_data);
            const user = this.api.docDataQuery(`users/${user_data[0]}`, true);
            // const user: any = this.api.getDocById(`users/${user_data[0]}`);
            element.user = user;
          });
          return data;
        }),
        switchMap((data: any) => {
          return of(data);
        })
      );
  }

  getChatRoomMessages(chatRoomId: any) {
    this.selectedChatRoomMessages = this.api
      .collectionDataQuery(
        `chats/${chatRoomId}/messages`,
        this.api.orderByQuery('createdAt', 'desc')
      )
      .pipe(map((arr: any) => arr.reverse()));
  }

  async sendMessage(chatId: any, msg: any) {
    try {
      const new_message = {
        message: msg,
        sender: this.currentUserId,
        createdAt: new Date(),
      };
      // console.log(chatId);
      if (chatId) {
        await this.api.addDocument(`chats/${chatId}/messages`, new_message);
      }
    } catch (e) {
      throw e;
    }
  }
}
