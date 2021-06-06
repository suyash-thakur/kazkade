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
import { MasterUserSettingComponent } from './master-user-setting/master-user-setting.component';
import { UserProfileComponent } from './master-user-setting/user-profile/user-profile.component';
import { FollowerListComponent } from './follower-list/follower-list.component';
import { NewsComponent } from './news/news.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { AboutComponent } from './about/about.component';
import { DepositComponent } from './deposit/deposit.component';
import { AdminComponent } from './admin/admin.component';
import { TermsComponent } from './terms/terms.component';
import { TradingMarketComponent } from './trading-market/trading-market.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordInputComponent } from './forgot-password-input/forgot-password-input.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { QrcodeVerifyComponent } from './qrcode-verify/qrcode-verify.component';


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

    // canActivate: [AuthGuard]
  },
  {
    path: 'news',
    component: NewsComponent
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
  },
  {
    path: 'settings',
    component: MasterUserSettingComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'userProfile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'followerList',
    component: FollowerListComponent,
    canActivate: [AuthGuard]

  }, {
    path: 'profitLoss',
    component: ProfitLossComponent,
    canActivate: [AuthGuard]

  }, {
    path: 'about',
    component: AboutComponent
  }, {
    path: 'deposit',
    component: DepositComponent
  }, {
    path: 'admin',
    component: AdminComponent
  }, {
    path: 'terms',
    component: TermsComponent
  }, {
    path: 'trade/:market/:coin',
    component: TradingMarketComponent
  }, {
    path: 'forgotPassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'enterForgotPassword',
    component: ForgotPasswordInputComponent
  },
  {
    path: 'qrcode',
    component: QrcodeComponent
  },
  {
    path: 'verify',
    component: QrcodeVerifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
