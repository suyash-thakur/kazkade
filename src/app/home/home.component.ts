import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public authService: AuthService, public dialog: MatDialog, public router: Router) { }

  ngOnInit(): void {
    this.authService.subscription = JSON.parse(localStorage.getItem('userSubscription'));
    console.log(this.authService.subscription);
  }
  selectPlan(plan) {
    if (this.authService.isLoggedIn === true) {
      this.authService.selectedPlan = plan;
      console.log(this.authService.subscription);
      if (this.authService.subscription === null || this.authService.subscription === undefined || this.authService.subscription.subscription_type == null) {
        this.router.navigate(['/deposit'])

      } else {
        this.openDialog();
      }
    } else {
      this.router.navigate(['/login']);
    }


  }
  openDialog() {

    this.dialog.open(planeSelected, {});
  }
}
@Component({
  selector: 'app-plan-selected',
  templateUrl: 'planeSelected.html',
  styleUrls: ['home.component.css']
})
export class planeSelected {
  constructor(public dialogRef: MatDialogRef<planeSelected>) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
