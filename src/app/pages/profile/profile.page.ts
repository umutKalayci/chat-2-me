import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';

import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('map') mapRef!: ElementRef;
  map!: GoogleMap;
  profileForm = new FormGroup({
    photo: new FormControl(''),
    email: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    images: new FormArray([]),
    lat: new FormControl(0),
    lng: new FormControl(0),
  });
  isLoading = true;
  currentUserId: any;

  imgRes: any;

  constructor(private auth: AuthService) {
    this.currentUserId = this.auth.getId();
    this.auth.getUserData(this.currentUserId).then((data) => {
      this.initForm(data);
      this.createMap();
    });
  }
  async fetchLocation() {
    const location = await Geolocation.getCurrentPosition();
    this.profileForm.controls.lat.setValue(location.coords.latitude);
    this.profileForm.controls.lng.setValue(location.coords.longitude);
    this.addMarker();
    console.log(location.coords);
  }
  ngOnInit() {}

  async createMap() {
    console.log(this.getLocation());
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: environment.mapsKey,
      element: this.mapRef.nativeElement,
      // forceCreate: true,
      config: {
        center: this.getLocation(),
        zoom: 8,
      },
    });
    this.isLoading = false;
    this.addMarker();
  }
  getLocation() {
    return {
      lat: this.profileForm.controls.lat.value || 1,
      lng: this.profileForm.controls.lng.value || 1,
    };
  }
  async addMarker() {
    await this.map.setCamera({
      coordinate: this.getLocation(),
      zoom: 8,
      animate: true,
    });
    const marker: Marker = {
      coordinate: this.getLocation(),
    };
    await this.map.addMarker(marker);
  }

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
      lat: profileData?.lat || 1,
      lng: profileData?.lng || 1,
    });
  }
  save() {
    console.log(this.profileForm.value);
    this.isLoading = true;
    this.auth
      .updateUserData(this.currentUserId, this.profileForm.value)
      .finally(() => {
        console.log('yklendi');
        this.isLoading = false;
      });
  }
}
