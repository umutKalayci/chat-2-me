import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm!: FormGroup;
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

  ngOnInit() {}

  initForm() {
    this.signupForm = new FormGroup({
      username: new FormControl('', { validators: [Validators.required] }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  onSubmit() {
    if (!this.signupForm.valid) return;
    this.register(this.signupForm);
  }

  register(form: FormGroup) {
    this.isLoading = true;
    this.authService
      .register(form.value)
      .then((data: { id: string }) => {
        this.isLoading = false;
        form.reset();
        this.router.navigateByUrl('/pages/disover');
      })
      .catch((e: any) => {
        this.isLoading = false;
        let msg: string = 'Could not sign you up, please try again.';
        if (e.code == 'auth/email-already-in-use') {
          msg = 'Email already in use';
        }
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
