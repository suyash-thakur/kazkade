import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PredictComponent } from './predict/predict.component';
import { BoughtComponent } from './bought/bought.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'
import { AuthGuard } from './shared/auth.guard';
import { MarketComponent } from './market/market.component';
import {HomeComponent} from './home/home.component'
import { MarketviewComponent } from './marketview/marketview.component';
import { TradingComponent } from './trading/trading.component';
import { KycComponent } from './kyc/kyc.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BinancekeysComponent } from './binancekeys/binancekeys.component';
import { MtlistComponent } from './mtlist/mtlist.component';


const routes: Routes = [
  {
    path: 'bought',
    component: BoughtComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'history',
    component: PredictComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'masterlist',
    component: MtlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'market',
    component: MarketComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'keys',
    component: BinancekeysComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'trading',
    component: TradingComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'marketview',
    component: MarketviewComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'kyc',
    component: KycComponent,
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
