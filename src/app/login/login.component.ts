import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './../shared/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signinForm: FormGroup;
  signupForm: FormGroup;
  a = 0;
  b = 0;
  errMsg = '';
  isForgotPass = false;
  isDisabled = true;
  showMsg = false;
  isSignedUp = false;
  isSignupValid = false;
  isLoadingSignup = false;
  errMsg2 = '';

  emailValidExpe: RegExp = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  passwordValidExpe: RegExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/);

  emailPassword = '';
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
  ) {
    this.signinForm = this.fb.group({
      email: [''],
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
    if (this.signinForm.value.email !== '' && this.signinForm.value.email !== null &&
      this.signinForm.value.password !== '' && this.signinForm.value.password !== null)
    {
      this.authService.signIn(this.signinForm.value);


    }
    else
    {

      this.signinForm.reset();

      this.b = 1;
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
    this.isLoadingSignup = true;
    console.log(this.signupForm.value.email, this.signupForm.value.password);
    console.log(this.passwordValidExpe.test(this.signupForm.value.password));
    console.log(this.emailValidExpe.test(this.signupForm.value.email));


    if (this.signupForm.value.email !== '' && this.signupForm.value.email !== null
      && this.signupForm.value.password !== '' && this.signupForm.value.password !== null)
    {
      if (this.signupForm.value.U_c_pass !== this.signupForm.value.password) {
        this.signupForm.reset();
        this.errMsg = 'Password does not match';
        this.a = 1;
        this.isSignupValid = false;
        this.isSignedUp = false;
        return;
      }
      if (this.passwordValidExpe.test(this.signupForm.value.password) && this.emailValidExpe.test(this.signupForm.value.email)) {
        this.authService.signUp(this.signupForm.value).subscribe((res) => {
          this.isLoadingSignup = false;

          console.log("Success", res);
          this.signupForm.reset();
          this.isSignupValid = false;
          this.a = 0;
          this.isSignedUp = true;
          const dialogRef = this.dialog.open(SignupDialogComponent);
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');

          });
        }, (err) => {
          console.log(err.status);
          if (err.status === 400) {
            this.signupForm.reset();
            this.isSignupValid = true;
            this.errMsg2 = err.msg;
            this.isSignedUp = false;
            this.a = 0;
            return;
          }
          if (err.status === 401) {
            this.signupForm.reset();
            this.isSignupValid = true;
            this.errMsg2 = err.msg;
            this.isSignedUp = false;
            this.a = 0;
            return;
          }
        });
      } else {
        this.signupForm.reset();
        this.errMsg = `Password must contain minimum 8 characters, at least one letter and one number`;
        this.a = 1;
        this.isSignupValid = false;
        this.isSignedUp = false;


      }

    }
    else{
      this.signupForm.reset();
      // this.router.navigate(['register']);
      this.errMsg = 'Please provide all the necessary details';
      this.isSignupValid = false;
      this.isSignedUp = false;

      this.a = 1;
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
@Component({
  selector: 'payment-dialog',
  templateUrl: './signupDialog.html',
  styleUrls: ['./login.component.css']

})
export class SignupDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SignupDialogComponent>,) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
