import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../shared/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-mtlist',
  templateUrl: './mtlist.component.html',
  styleUrls: ['./mtlist.component.css']
})
export class MtlistComponent implements OnInit {

  panelOpenState = false;
  endpoint = environment.Route+'/api/master-trader';

  arr: any = [];
  selectedType = 'AUTO';
  selectedId = '';
  followerId = [];
  amount: any;
  followMsg = '';
  isLoaded = false;


  constructor(private httpService: HttpClient,public router: Router,
    private http: HttpClient, public authService: AuthService, public dialog: MatDialog,
    private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(localStorage.getItem('userSubscription'));
    this.authService.subscription = JSON.parse(localStorage.getItem('userSubscription'));
    console.log(this.authService.subscription);

    if (this.authService.subscription === 'null' || this.authService.subscription === null) {
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, { panelClass: 'mat-dialog-container-o' });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      });
    } else if (this.authService.subscription.subscription_status === false) {
      console.log('dialog');
      const dialogRef = this.dialog.open(PaymentDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      });
    }


    this.http.get(this.endpoint).subscribe((res: any) => {
      this.arr = res;
      this.isLoaded = true;
      console.log(this.arr);
    },
    (err: HttpErrorResponse) => {
      console.log (err.message);
    }
    );
    this.http.get(environment.Route + '/api/master-trader/followed').subscribe((res: any) => {
      console.log(res);

      let followIds = [];
      res.forEach((item) => {
        followIds.push(item.master_trader_id);
      })

      this.followerId = followIds;
    });

    console.log(this.followerId);

  }
  unFollow(id) {
    this.http.post(environment.Route + '/api/master-trader/unfollow', { master_trader_id: id }).subscribe((res: any) => {
      console.log(res);
      let followArray = this.followerId;
      console.log(this.followerId);
      console.log(id);

      let index = this.followerId.indexOf(id);
      console.log(index);
      followArray.splice(index, 1);
      console.log(followArray);

      this.followerId = followArray;
      console.log(this.followerId);
    });
  }
  selectId(id) {
    this.selectedId = id
  }
  disabled = false;
  toggleCheckbox(e) {
    if (e.target.checked) {
      this.disabled = true;
      this.selectedType = 'AUTO';
      console.log(this.disabled);

    } else {
      this.disabled = false;
      this.selectedType = 'MANUAL';

    }
  }
  ifFollower(id) {
    if (this.followerId.indexOf(id) === -1) {
      return false;
    } else {
      return true;
    }
  }
  followmasterTrader() {
    if (this.disabled === true) {
      this.selectedType = 'AUTO';

      this.http.post(this.endpoint + '/follow', { master_trader_id: this.selectedId, trade_type: this.selectedType }).subscribe((res: any) => {
        console.log(res);
        this.followMsg = res.msg;
        console.log(this.followMsg);
        if (res.msg == 'success') {
          let followTemp = this.followerId;
          followTemp.push(this.selectedId);
          this.followerId = followTemp;
          setTimeout(() => {
            document.getElementById("closeModalButton").click();
            this.followMsg = '';

          }, 1000);

        }

      });
    } else {
      this.selectedType = 'MANUAL';
      this.http.post(this.endpoint + '/follow', { master_trader_id: this.selectedId, trade_type: this.selectedType, ratio: this.amount }).subscribe((res: any) => {
        console.log(res);
        this.followMsg = res.msg;

        if (res.msg == 'success') {
          let followTemp = this.followerId;
          followTemp.push(this.selectedId);
          this.followerId = followTemp;
          setTimeout(() => {
            document.getElementById("closeModalButton").click();
            this.followMsg = '';

          }, 1000);
        }
      });
    }

  }
  isFollowers(id): any {



  }
  openDialog(): void {

  }
  viewMasterTrade(data) {
    console.log(data);

    this.router.navigate(['/userProfile']);
  }
  viewMaster(data) {
    this.authService.selectedMasterTrader = data;
    this.dialog.open(MasterDataComponent);
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'followType.html',
  styleUrls: ['./mtlist.component.css']

})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data, public authService: AuthService, public router: Router, public dialog: MatDialog) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectPlan(plan) {
    this.authService.selectedPlan = plan;
    this.router.navigate(['/deposit']);
    this.dialog.closeAll();
  }

}
@Component({
  selector: 'payment-dialog',
  templateUrl: 'paymentPending.html',
  styleUrls: ['./mtlist.component.css']

})
export class PaymentDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, public authService: AuthService, public router: Router, public dialog: MatDialog) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
@Component({
  selector: 'master-data',
  templateUrl: 'master-data.html',
})
export class MasterDataComponent {
  userData;
  pilData = [];
  assetsData = [];
  winCount = 0;
  lossCount = 0;
  totalPnl = "0";

  constructor(public authService: AuthService) {
    this.userData = this.authService.selectedMasterTrader;
    console.log(this.userData);
    if (this.userData.balance.positions !== undefined) {
      this.totalPnl = this.userData.balance.totalUnrealizedProfit;
      this.userData.balance.positions.forEach(data => {
        if (data.positionAmt > 0) {
          if (data.unrealizedProfit.indexOf('-') > -1) {
            this.lossCount = this.lossCount + 1;
          } else {
            this.winCount = this.winCount + 1;
          }
          this.pilData.push(data);
        }
      });
    }
    if (this.userData.balance.assets !== undefined) {
      this.userData.balance.assets.forEach(data => {
        this.assetsData.push(data)
      });
    }

  }

}
