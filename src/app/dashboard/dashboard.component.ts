import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from './../shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
 
/**
 * @title Injecting data when opening a dialog
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  color='#981B40';
  amount:any;
  currency:any;
  public data :any[];
  endpoint = environment.Route+'/api/user';
  

  constructor(public dialog: MatDialog,private httpService: HttpClient,public router: Router,
    private http: HttpClient, public authService: AuthService,
    private actRoute: ActivatedRoute) {
      let id = this.actRoute.snapshot.paramMap.get('id');
      this.data=[];
    }
  ngOnInit(): void {
    // this.openDialog();
    this.http.get<any>(this.endpoint+'/user-balance').subscribe((res: any) => {
      this.amount = res.balances[0].free;
      this.currency = res.balances[0].asset;

      this.data=[{
        kind: this.currency, share: Number(this.amount)/Number(this.amount)
      }];
      //  [{
      //   kind: 'Hydroelectric', share: 0.175
      // }, {
      //   kind: 'Nuclear', share: 0.238
      // }, {
      //   kind: 'Coal', share: 0.118
      // }, {
      //   kind: 'Solar', share: 0.052
      // }, {
      //   kind: 'Wind', share: 0.225
      // }, {
      //   kind: 'Other', share: 0.192
      // }];
    
      console.log(this.data);
      // console.log(res);
    },
    (err: HttpErrorResponse) => {
      console.log (err.message);
    }
    );

    if(this.authService.getToken()!=null)
    {
      this.router.navigate(['/dashboard']);
    }
  }

  public labelContent(e: any): string {
    return e.category;
  }

  registerMaster(){
    const api = `${this.endpoint}/user-type`;
    this.http.post(api, {
      "user_type": "MASTER"
    })
      .pipe(
        catchError(this.handleError)
      );
   

  }
  handleError(handleError: any): import("rxjs").OperatorFunction<Object, any> {
    throw new Error('Method not implemented.');
  }

  openDialog() {
    
    this.dialog.open(DialogDataExampleDialog, {});
  }

}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
  styleUrls: ['dashboard.component.css']
})
export class DialogDataExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialog>) {}
    onNoClick(): void {
      this.dialogRef.close();
    }
}



function res(res: any, any: any) {
  throw new Error('Function not implemented.');
}

