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
  view: any[] = [500, 400]
  color='#981B40';
  amount:any;
  currency:any;
  dataArray = [];
  dataArrayTemp = [];
  isloaded = false;
  isInvalidAPI = false;
  endpoint = environment.Route+'/api/user';
  pieData = [
    {
      "name": "Spain",
      "value": 33000,
    },
    {
      "name": "Israel",
      "value": 45445
    },
    {
      "name": "India",
      "value": 50922
    },
    {
      "name": "Vanuatu",
      "value": 34420
    }
  ]


  constructor(public dialog: MatDialog,private httpService: HttpClient,public router: Router,
    private http: HttpClient, public authService: AuthService,
    public actRoute: ActivatedRoute) {
      let id = this.actRoute.snapshot.paramMap.get('id');

    }
  ngOnInit(): void {
    // this.openDialog();
    console.log(this.authService.userType);
    this.http.get<any>(environment.Route + '/api/action/future-balance').subscribe((res: any) => {
      console.log(res);
      if (res.data.msg === "API-key format invalid.") {
        this.isInvalidAPI = true;
        this.dialog.open(APIKeyComponent, {});
        return;
      }
      res.data.forEach((item) => {
        if (Number(item.availableBalance) > 0) {
          var pieDataVa = {
            "name": item.asset,
            "value": Number(item.availableBalance)


          }
          this.dataArrayTemp.push(pieDataVa);
        }
      });
    });
    if (this.authService.userType !== undefined) {

      this.http.get<any>(environment.Route + '/api/action/future-account').subscribe((res: any) => {
        console.log(res);

        res.data.positions.forEach((data: any) => {
          if (Number(data.entryPrice) > 0) {
            var pieDataVa = {
              "name": data.symbol,
              "value": Number(data.positionAmt)


            }
            this.dataArrayTemp.push(pieDataVa);

          }

        });
        this.dataArray = this.dataArrayTemp;
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

        console.log(this.dataArray);
        console.log(this.pieData);

        this.isloaded = true;
      // console.log(res);
    },
    (err: HttpErrorResponse) => {
      console.log (err.message);
    }
    );
    }

    if(this.authService.getToken()!=null)
    {
      this.router.navigate(['/dashboard']);
    }
  }
  toggleFuture() {
    this.dataArrayTemp = [];

    this.http.get<any>(environment.Route + '/api/action/future-balance').subscribe((res: any) => {
      console.log(res);
      res.data.forEach((item) => {
        if (Number(item.availableBalance) > 0) {
          var pieDataVa = {
            "name": item.asset,
            "value": Math.abs(Number(item.availableBalance))


          }
          this.dataArrayTemp.push(pieDataVa);
        }
      });
      this.http.get<any>(environment.Route + '/api/action/future-account').subscribe((res: any) => {
        console.log(res);

        res.data.positions.forEach((data: any) => {
          if (Number(data.entryPrice) > 0) {
            var pieDataVa = {
              "name": data.symbol,
              "value": Math.abs(Number(data.positionAmt))


            }
            this.dataArrayTemp.push(pieDataVa);

          }

        });
        this.dataArray = this.dataArrayTemp;


        console.log(this.dataArray);

        this.isloaded = true;
        // console.log(res);
      },
        (err: HttpErrorResponse) => {
          console.log(err.message);
        }
      );
    });

  }
  togggleSpot() {
    this.http.get<any>(environment.Route + '/api/user/user-balance').subscribe((res: any) => {
      console.log(res);
      this.dataArrayTemp = [];

      res.forEach((data: any) => {

        var pieDataVa = {
          "name": data.asset,
          "value": Math.abs(Number(data.free))


        }

        this.dataArrayTemp.push(pieDataVa);



      });
      this.dataArray = this.dataArrayTemp;


      console.log(this.dataArray);
      console.log(this.pieData);

      this.isloaded = true;
      // console.log(res);
    },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }
  public labelContent(e: any): string {
    return e.category;
  }

  registerMaster(){
    const api = `${this.endpoint}/user-type`;
    this.http.post(api, {
      "user_type": "MASTER"
    }).subscribe((res) => {
      console.log(res);
      this.authService.userType = "MASTER";
      this.openDialog();
      this.authService.tokenRefresh();
    });



  }

  registerCopy() {
    const api = `${this.endpoint}/user-type`;
    this.http.post(api, {
      "user_type": "COPY"
    }).subscribe((res) => {
      console.log(res);
      this.authService.userType = "COPY";
      this.authService.tokenRefresh();

    });
    this.router.navigate(['/masterlist']);

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

@Component({
  selector: 'app-api-key',
  templateUrl: 'apiKeyError.html',
  styleUrls: ['dashboard.component.css']
})

export class APIKeyComponent {
  constructor(public dialogRef: MatDialogRef<APIKeyComponent>, public router: Router) { }
  buttonClick(): void {
    this.router.navigate(['/settings']);
    this.dialogRef.close();
  }
}
