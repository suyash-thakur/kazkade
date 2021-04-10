import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-user-setting',
  templateUrl: './master-user-setting.component.html',
  styleUrls: ['./master-user-setting.component.css']
})
export class MasterUserSettingComponent implements OnInit {
  showFiller = false;
  opened = false;

  constructor() {
    if (window.innerWidth > 720) {
      this.opened = true;
    }
  }

  ngOnInit(): void {
  }

}
