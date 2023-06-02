import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm = new FormGroup({
    photo: new FormControl(''),
    email: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    images: new FormArray([]),
  });
  currentUserId: any;

  imgRes: any;

  constructor(private auth: AuthService) {
    this.currentUserId = this.auth.getId();
    this.auth.getUserData(this.currentUserId).then((data) => {
      this.initForm(data);
    });
  }

  ngOnInit() {}

  get images(): FormArray {
    return this.profileForm.get('images') as FormArray;
  }

  addImage() {
    this.images.push(new FormControl());
  }
  deleteImage(i: any) {
    this.images.removeAt(i);
  }

  initForm(profileData: any) {
    for (let i = 0; i < profileData.images.length; i++) this.addImage();
    this.profileForm.setValue({
      photo: profileData?.photo,
      email: profileData?.email,
      name: profileData?.name,
      description: profileData?.description,
      images: profileData.images,
    });
  }
  save() {
    console.log(this.profileForm.value);
    this.auth.updateUserData(this.currentUserId, this.profileForm.value);
  }
}
