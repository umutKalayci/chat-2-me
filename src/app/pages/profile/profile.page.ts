import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm!: FormGroup;

  currentUserId: any;
  constructor(private auth: AuthService) {
    this.currentUserId = this.auth.getId();
    this.auth.getUserData(this.currentUserId).then((data) => {
      this.initForm(data);
      console.log(data);
      console.log(this.currentUserId);
    });
  }

  ngOnInit() {}

  initForm(profileData: any) {
    this.profileForm = new FormGroup({
      email: new FormControl(profileData?.email),
      name: new FormControl(profileData?.name),
      description: new FormControl(profileData?.description),
    });
  }
  save() {
    console.log(this.profileForm.value);
    this.auth.updateUserData(this.currentUserId, this.profileForm.value);
  }
}
