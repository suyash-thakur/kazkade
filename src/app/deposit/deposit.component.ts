import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  qrCode = 'xcaj90sae332908wdjopasdj9as87d7321rnjkoasancsa0990snklxcho';
  paymentId = '';
  isSubmit = false;
  coin = 'BTC';
  selectedIndex = 0;

  arr = [0, 1, 2];
  constructor(private http: HttpClient, public authService: AuthService) { }

  ngOnInit(): void {
  }
  selectCoin(data) {
    console.log(data);
    this.selectCoin = data;
    this.selectedIndex = 0;
  }
  submitPayment(data) {
    console.log(this.authService.selectedPlan.toUpperCase());
    console.log(data);
    this.http.post(environment.Route + '/api/subscription/add-Subscription', { subscription_type: this.authService.selectedPlan.toUpperCase(), payment_reference_number: this.paymentId, coin: data }).subscribe((res: any) => {
      this.isSubmit = true;
      this.authService.tokenRefresh();
    });
  }

  toggleSelected(i) {
    this.selectedIndex = i;
  }
}
