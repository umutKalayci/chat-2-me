import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public _uid = new BehaviorSubject<string>('');
  currentUser: any;

  constructor(private fireAuth: Auth, private apiService: ApiService) {
    this.getId();
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await signInWithEmailAndPassword(
        this.fireAuth,
        email,
        password
      );
      if (response?.user) this.setUserData(response.user.uid);
    } catch (e) {
      throw e;
    }
  }

  getId() {
    const auth = getAuth();
    this.currentUser = auth.currentUser;
    return this.currentUser?.uid;
  }

  setUserData(uid: string) {
    this._uid.next(uid);
  }

  randomIntFromInterval(min: any, max: any) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async register(formValue: any) {
    try {
      const registeredUser = await createUserWithEmailAndPassword(
        this.fireAuth,
        formValue.email,
        formValue.password
      );
      const data = {
        uid: registeredUser.user.uid,
        email: formValue.email,
        name: formValue.username,
        description: '',
        photo: 'https://i.pravatar.cc/' + this.randomIntFromInterval(200, 400),
        images: [
          'https://ionicframework.com/docs/img/demos/card-media.png',
          'https://ionicframework.com/docs/img/demos/card-media.png',
          'https://ionicframework.com/docs/img/demos/card-media.png',
        ],
      };
      await this.apiService.setDocument(
        `users/${registeredUser.user.uid}`,
        data
      );
      const userData = {
        id: registeredUser.user.uid,
      };
      this.setUserData(registeredUser.user.uid);
      return userData;
    } catch (e) {
      throw e;
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.fireAuth, email);
    } catch (e) {
      throw e;
    }
  }

  async logout() {
    try {
      await this.fireAuth.signOut();
      this._uid.next('');
      return true;
    } catch (e) {
      throw e;
    }
  }

  checkAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.fireAuth, (user) => {
        resolve(user);
      });
    });
  }

  async getUserData(id: any) {
    const docSnap: any = await this.apiService.getDocById(`users/${id}`);
    if (docSnap?.exists()) {
      return docSnap.data();
    } else {
      throw 'No such document exists';
    }
  }
  async updateUserData(userId: any, data: any) {
    try {
      await this.apiService.updateDocument(`users/${userId}`, data);
    } catch (error) {
      console.log(error);
    }
  }
}
