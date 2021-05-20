import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
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
  userData;
  constructor(public dialog: MatDialog, public authService: AuthService) { }

  ngOnInit(): void {
    this.userData = this.authService.selectedMasterTrader;
    console.log(this.userData);
  }
  public pointColor(point: any): string {
    const summary = point.dataItem.summary;
    if (summary) {
      return summary === 'total' ? '#555' : 'gray';
    }

    if (point.value > 0) {
      return 'green';
    } else {
      return 'red';
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(CopyInfoComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'copy-info',
  templateUrl: 'copy-info.component.html',
})
export class CopyInfoComponent {

  disabled = false;
  toggleCheckbox(e) {
    if (e.target.checked) {
      this.disabled = true;
      console.log(this.disabled);

    } else {
      this.disabled = false;

    }
  }
}
