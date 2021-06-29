import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-follower-list',
  templateUrl: './follower-list.component.html',
  styleUrls: ['./follower-list.component.css']
})
export class FollowerListComponent implements OnInit {
  followerList = [];
  isLoading = false;

  constructor(public dialog: MatDialog, private http: HttpClient, public authservice: AuthService) { }

  ngOnInit(): void {
    var payload = {
      'master_trader_id': this.authservice.id
    }
    if (this.authservice.userType !== 'COPY') {
      this.http.get(environment.Route + '/api/master-trader/followers').subscribe((res: any) => {
        console.log(res);
        this.followerList = res;
        this.isLoading = true;
      });
    } else {
      this.http.get(environment.Route + '/api/master-trader/followed').subscribe((res: any) => {
        console.log(res);
        this.followerList = res;
        this.isLoading = true;

      });
    }


  }
  openDialog(index) {
    let bottom;
    if (window.innerHeight < 700) {
      bottom = 0;
    }
    const dialogRef = this.dialog.open(PilComponent, {
      width: '550px',
      data: this.followerList[index],
      position: {
        bottom: bottom,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
@Component({
  selector: 'pil',
  templateUrl: 'pil.component.html',
})
export class PilComponent {
  pilData = [];
  item;
  lossCount: any = 0;
  winCount: any = 0;
  msg = ''
  isShowMsg = false;
  sucMsg = '';
  constructor(
    public dialogRef: MatDialogRef<PilComponent>,
    @Inject(MAT_DIALOG_DATA) public data, public authservice: AuthService, public http: HttpClient) {
    this.item = data;
    this.lossCount = 0;
    this.winCount = 0;
    this.isShowMsg = false;

    console.log(this.item);
    data.balance.positions.forEach(data => {
      if (data.positionAmt !== 0) {
        this.pilData.push(data);
      }
      if (data.positionAmt > 0) {
        if (data.unrealizedProfit.indexOf('-') > -1) {
          this.lossCount = this.lossCount + 1;
        } else {
          this.winCount = this.winCount + 1;
        }
      }
    });
  }
  sendNotif() {
    this.http.post(environment.Route + '/api/master-trader/send-notification', {
      follower_id: this.item.id, msg: this.msg
    }).subscribe((res: any) => {
      console.log(res);
      this.isShowMsg = true;
      this.sucMsg = 'Notification Send';
    });
  }
  public saleData = [
    {
      "name": "Q1",
      "series": [
        {
          "name": "1001",
          "value": -10632
        },
        {
          "name": "2001",
          "value": -36953
        }
      ]
    },
    {
      "name": "Q2",
      "series": [
        {
          "name": "1001",
          "value": -19737
        },
        {
          "name": "2001",
          "value": 45986
        }
      ]
    },
    {
      "name": "Q3",
      "series": [
        {
          "name": "1001",
          "value": -16745
        },
        {
          "name": "2001",
          "value": 0
        }
      ]
    },
    {
      "name": "Q4",
      "series": [
        {
          "name": "1001",
          "value": -16240
        },
        {
          "name": "2001",
          "value": 32543
        }
      ]
    }
  ];
}
