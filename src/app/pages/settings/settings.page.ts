import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { SETTINGS } from './default-settings';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  currentUserId: any;
  settings: any = SETTINGS;
  constructor(private auth: AuthService, private router: Router) {
    this.currentUserId = this.auth.getId();
    this.auth
      .getUserSettings(this.currentUserId)
      .then((data) => {
        Object.entries(data).forEach(([key, value], index) => {
          console.log(key, value, index);
          this.settings[key] = value;
        });
      })
      .catch((err) => {
        console.log(err);
      });
    this.auth.getUserData(this.currentUserId).then((data) => {
      console.log(this.currentUserId);
      console.log(data);
    });
  }
  async logout() {
    try {
      await this.auth.logout();
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (e) {
      console.log(e);
    }
  }
  rangePinFormatter(value: number) {
    return value < 100 ? `${value}km` : `99km+`;
  }
  saveSettings() {
    console.log(this.settings, this.currentUserId);
    this.auth
      .updateUserSettings(this.currentUserId, this.settings)
      .finally(() => {
        console.log('yklendi');
      });
    this.auth
      .updateUserDiscoverSetting(this.currentUserId, {
        isDiscover: this.settings.discoverValue,
      })
      .finally(() => {
        console.log('yklendi');
      });
  }
}
