import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form!: FormGroup;
  isTypePassword: boolean = true;
  _isLoading: boolean = false;
  get isLoading() {
    return this._isLoading;
  }
  set isLoading(value: boolean) {
    value ? this.showLoader() : this.hideLoader();
    this._isLoading = value;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.login(this.form);
  }

  login(form: FormGroup) {
    this.isLoading = true;
    this.authService
      .login(form.value.email, form.value.password)
      .then((data) => {
        this.isLoading = false;
        this.router.navigateByUrl('/pages/disover');
        form.reset();
      })
      .catch((e) => {
        this.isLoading = false;
        let msg: string = 'Could not sign you in, please try again.';
        if (e.code == 'auth/user-not-found')
          msg = 'E-mail address could not be found';
        else if (e.code == 'auth/wrong-password')
          msg = 'Please enter a correct password';
        this.showAlert(msg);
      });
  }

  async showAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  showLoader() {
    this.loadingCtrl
      .create({
        message: 'Loading...',
      })
      .then((response) => {
        response.present();
      });
  }
  hideLoader() {
    this.loadingCtrl.dismiss();
  }
}
