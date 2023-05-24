import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm!: FormGroup;
  isTypePassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
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

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    if (!this.signupForm.valid) return;
    console.log(this.signupForm.value);
    this.register(this.signupForm);
  }

  register(form: any) {
    // this.global.showLoader();
    this.isLoading = true;
    console.log(form.value);
    this.authService
      .register(form.value)
      .then((data: any) => {
        console.log(data);
        this.router.navigateByUrl('/home');
        // this.global.hideLoader();
        this.isLoading = false;
        form.reset();
      })
      .catch((e: any) => {
        console.log(e);
        // this.global.hideLoader();
        this.isLoading = false;
        let msg: string = 'Could not sign you up, please try again.';
        if (e.code == 'auth/email-already-in-use') {
          msg = 'Email already in use';
        }
        this.showAlert(msg);
      });
  }

  async showAlert(msg: any) {
    const alert = await this.alertController.create({
      header: 'Alert',
      // subHeader: 'Important message',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
