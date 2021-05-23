import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from './../shared/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'binancekeys',
    templateUrl: 'binancekeys.component.html',
    styleUrls: ['binancekeys.component.css']
  })
  export class BinancekeysComponent {
    keys: FormGroup;
  endpoint = environment.Route + '/api/user';
  pathKey: String = '';
  pathSecret: String = '';

    constructor(
      public dialog: MatDialog,
      public fb: FormBuilder,
      public authService: AuthService,
      public router: Router,
      private http: HttpClient,
      private httpService: HttpClient,
      private actRoute: ActivatedRoute) {

        let id = this.actRoute.snapshot.paramMap.get('id');

        this.keys = this.fb.group({
          path_api_key: [''],
          path_secret_key: ['']
        });

      }


      onSubmit() {
        var t:any;
        console.log(this.keys.value);
        const url_to_hit = this.endpoint + '/user-key';

        this.httpService.post(url_to_hit, { path_api_key: this.pathKey, path_secret_key: this.pathSecret }, { observe: 'response' })
        .subscribe((response: any) => {
            // localStorage.setItem('access_token', res.access_token);
            t=response.status;
            localStorage.setItem('binance_user','true');
            this.router.navigate(['/dashboard']);
        },
        (err: HttpErrorResponse) => {
          // this.t=false;
          t=err.status;
          // console.log (err.status);
          // this.router.navigate(['/keys']);
          this.dialog.open(DialogDataExampleDialog, {});
        }
        );

      }


  }




  @Component({
    selector: 'dialog-data-example-dialog',
    templateUrl: 'dialog-data-example-dialog.html',
    styleUrls: ['binancekeys.component.css']
  })
  export class DialogDataExampleDialog {
    constructor(public router: Router,
      public dialogRef: MatDialogRef<DialogDataExampleDialog>) {}
      onNoClick(): void {
        this.dialogRef.close();
        this.router.navigate(['/dashboard']);

      }
  }
