import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signinForm: FormGroup;
  signupForm: FormGroup;
  a = 0;
  isForgotPass = false;
  isDisabled = true;
  showMsg = false;
  isSignedUp = false;

  emailValidExpe: RegExp = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  passwordValidExpe: RegExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

  emailPassword = '';
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.signinForm = this.fb.group({
      mno: [''],
      password: ['']
    });
    this.signupForm = this.fb.group({
      full_name: [''],
      mno: [''],
      email: [''],
      password: [''],
      U_c_pass: ['']
    });
  }

  ngOnInit() {
    if(this.authService.getToken()!=null)
    {
      this.router.navigate(['/dashboard']);
    }
  }
  callinvert()
  {
    this.a=0
  }
  togglePassword() {
    this.isForgotPass = !this.isForgotPass;
  }
  loginUser() {
    // console.log(this.signinForm.value)
    if(this.signinForm.value.mno!=='' && this.signinForm.value.mno!==null &&
      this.signinForm.value.password !== '' && this.signinForm.value.password !== null)
    {
      this.authService.signIn(this.signinForm.value);


    }
    else
    {
      this.signinForm.reset();

      this.a=1;
    }
  }
  sendmail() {
    this.authService.sendEmail(this.emailPassword).subscribe((res) => {
      this.showMsg = true;
    });
  }
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.isDisabled = false;
  }
  registerUser() {
    if (this.signupForm.value.email !== '' && this.signupForm.value.email !== null
      && this.signupForm.value.password !== '' && this.signupForm.value.password !== null
      // && this.signupForm.value.password!=this.signupForm.value.password
      && this.signupForm.value.Email_id !== '' && this.signupForm.value.Email_id !== null
      && this.passwordValidExpe.test(this.signupForm.value.password) && this.emailValidExpe.test(this.signupForm.value.Email_id))
    {
    this.authService.signUp(this.signupForm.value).subscribe((res) => {
      this.signupForm.reset();
      this.a = 1;
      this.isSignedUp = true;
      });
    }
    else{
      this.signupForm.reset();
      // this.router.navigate(['register']);
      this.a=1;
    }
  }
  check(){

    if(this.a==1)
    {
      return true;
    }
    return false;
  }
}
