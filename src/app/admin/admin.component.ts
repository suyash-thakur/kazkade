import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users = [];
  show = false;
  constructor(public http: HttpClient, public authService: AuthService) { }

  ngOnInit(): void {
    this.http.get(environment.Route + '/api/admin/all-copy-traders').subscribe((res: any) => {
      this.users = res;
      console.log(res);
      this.show = true;
    });
  }
  verify(id) {
    this.http.post(environment.Route + '/api/admin/verify-payment', { id: id }).subscribe((res) => {
      console.log(res);

      this.http.get(environment.Route + '/api/admin/all-copy-traders').subscribe((res: any) => {
        this.users = [];

        res.forEach((item: any) => {

          this.users.push(item);

        });
        console.log(res);
      });
    });

  }

  unVerify(id) {
    // console.log(id);
    // this.http.delete(environment.Route + '/api/admin/delete-payment', {
    //   id:this.id
    // })
    this.http.post(environment.Route + '/api/admin/undo-verify', {
      id: id
    }).subscribe((res: any) => {

      this.http.get(environment.Route + '/api/admin/all-copy-traders').subscribe((res: any) => {
        this.users = res;
        console.log(res);
        this.show = true;
      });
    });
  }
  deleteUser(id) {
    this.http.post(environment.Route + '/api/admin/delete-payment', {
      id: id
    }).subscribe((res: any) => {
      this.http.get(environment.Route + '/api/admin/all-copy-traders').subscribe((res: any) => {
        this.users = res;
        console.log(res);
        this.show = true;
      });
    });
  }
  unverify2fa(id) {
    this.http.post(environment.Route + '/api/admin/reset-2fa', {
      id: id
    }).subscribe((res: any) => {

    });
  }

}
