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
  constructor(private http: HttpClient, public authService: AuthService) { }

  ngOnInit(): void {
  }
  submitPayment() {
    console.log(this.authService.selectedPlan.toUpperCase());
    this.http.post(environment.Route + '/api/subscription/add-Subscription', { subscription_type: this.authService.selectedPlan.toUpperCase(), payment_reference_number: this.paymentId }).subscribe((res: any) => {
      this.isSubmit = true;
      this.authService.tokenRefresh();
    });
  }
}
