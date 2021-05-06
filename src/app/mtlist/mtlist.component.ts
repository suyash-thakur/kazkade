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


  constructor(private httpService: HttpClient,public router: Router,
    private http: HttpClient, public authService: AuthService, public dialog: MatDialog,
    private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
    this.http.get<any>(this.endpoint).subscribe((res: any) => {
      this.arr = res;
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
  selectId(id) {
    this.selectedId = id
  }
  disabled = false;
  toggleCheckbox(e) {
    if (e.target.checked) {
      this.disabled = true;
      console.log(this.disabled);

    } else {
      this.disabled = false;

    }
  }
  followmasterTrader() {
    if (this.disabled === true) {
      this.selectedType = 'AUTO';

      this.http.post(this.endpoint + '/follow', { master_trader_id: this.selectedId, trade_type: this.selectedType }).subscribe((res: any) => {
        console.log(res);
        if (res.msg == 'success') {
          let followTemp = this.followerId;
          followTemp.push(this.selectedId);
          this.followerId = followTemp;
        }
      });
    } else {
      this.selectedType = 'MANUAL';
      this.http.post(this.endpoint + '/follow', { master_trader_id: this.selectedId, trade_type: this.selectedType, ratio: this.amount }).subscribe((res: any) => {
        console.log(res);
        if (res.msg == 'success') {
          let followTemp = this.followerId;
          followTemp.push(this.selectedId);
          this.followerId = followTemp;
        }
      });
    }

  }
  isFollowers(id): any {



  }
  openDialog(): void {

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

