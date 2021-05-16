import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatInputModule} from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BoughtComponent } from './bought/bought.component';
import { ProfileComponent } from './profile/profile.component';
import { PredictComponent } from './predict/predict.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { JwtModule } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/authconfig.interceptor';
import { LoginComponent } from './login/login.component';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { environment } from 'src/environments/environment';
import { BuycomComponent } from './buycom/buycom.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WavesModule } from 'angular-bootstrap-md';
import { MarketComponent } from './market/market.component';
import { MatMenuModule } from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import { HomeComponent } from './home/home.component';
import { MarketviewComponent } from './marketview/marketview.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TradingComponent, DialogSell, DialogTrade } from './trading/trading.component';
import { KycComponent } from './kyc/kyc.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { BinancekeysComponent } from './binancekeys/binancekeys.component';
import { PilComponent } from './follower-list/follower-list.component';
import { MtlistComponent } from './mtlist/mtlist.component';
import { NgxDonutChartModule } from 'ngx-doughnut-chart';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatDialogModule} from '@angular/material/dialog';
import 'hammerjs';
import { MasterUserSettingComponent } from './master-user-setting/master-user-setting.component';
import { UserProfileComponent } from './master-user-setting/user-profile/user-profile.component';
import { FollowerListComponent } from './follower-list/follower-list.component';
import { Injectable } from '@angular/core';
import { NewsComponent } from './news/news.component';
import {MatSliderModule} from '@angular/material/slider';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { AboutComponent } from './about/about.component';
import { DepositComponent } from './deposit/deposit.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { AdminComponent } from './admin/admin.component';
import { SettingsComponent } from './settings/settings.component';
import { TermsComponent } from './terms/terms.component';
import { RecaptchaModule } from "ng-recaptcha";
import { TradingMarketComponent } from './trading-market/trading-market.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    AppComponent,
    BoughtComponent,
    ProfileComponent,
    LoginComponent,
    PredictComponent,
    RegisterComponent,
    BuycomComponent,
    MarketComponent,
    HomeComponent,
    MarketviewComponent,
    TradingComponent,
    KycComponent,
    DashboardComponent,
    BinancekeysComponent,
    MtlistComponent,
    DialogSell,
    DialogTrade,
    MasterUserSettingComponent,
    UserProfileComponent,
    FollowerListComponent,
    NewsComponent,
    ProfitLossComponent,
    AboutComponent,
    DepositComponent,
    AdminComponent,
    SettingsComponent,
    PilComponent,
    TermsComponent,
    TradingMarketComponent

  ],

  entryComponents: [
    BuycomComponent,
    DialogSell,
    DialogTrade,
    PilComponent
  ],
  imports: [
    MatFormFieldModule,
    NgxDonutChartModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    RecaptchaModule,
    WavesModule,
    NgApexchartsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    ClipboardModule,
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    NgxChartsModule,
    MatDialogModule,
    MatSelectModule,
    MatSliderModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
    }),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
             return     localStorage.getItem('access_token');},
        whitelistedDomains: [environment.Route],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
