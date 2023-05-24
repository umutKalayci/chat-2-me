import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form!: FormGroup;
  isTypePassword: boolean = true;
  isLogin = false;

  constructor(
    private router: Router,
    // private authService: AuthService,
    private alertController: AlertController
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

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    if (!this.form.valid) return;
    console.log(this.form.value);
    this.login(this.form);
  }

  login(form: FormGroup) {
    // this.global.showLoader();
    // this.authService
    //   .login(form.value.email, form.value.password)
    //   .then((data: any) => {
    //     console.log(data);
    //     this.router.navigateByUrl('/home');
    //     // this.global.hideLoader();
    //     form.reset();
    //   })
    //   .catch((e: any) => {
    //     console.log(e);
    //     // this.global.hideLoader();
    //     let msg: string = 'Could not sign you in, please try again.';
    //     if (e.code == 'auth/user-not-found')
    //       msg = 'E-mail address could not be found';
    //     else if (e.code == 'auth/wrong-password')
    //       msg = 'Please enter a correct password';
    //     this.showAlert(msg);
    //   });
  }

  async showAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      // subHeader: 'Important message',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }
}