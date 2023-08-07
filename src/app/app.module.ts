import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorInterceptor} from './shared/services/error.interceptor';
import {AuthService} from './shared/services/auth.service';
import {UserService} from './shared/services/user.service';
import {TaskService} from './shared/services/task.service';
import {MainComponent} from './main/main.component';
import {HomeComponent} from './home/home.component';
import {GreetingComponent} from './greeting/greeting.component';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import {TimerComponent} from './timer/timer.component';
import { HeaderComponent } from './header/header.component';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,
    GreetingComponent,
    TimerComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    NgbModule,
    NgOptimizedImage,
    RouterModule,
    NgxSpinnerModule.forRoot({ type: 'ball-8bits' })
  ],
  providers: [
    HttpClientModule,
    TaskService,
    UserService,
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '712997304582-9shvq04o1000slei338mtcpkspcnmi0p.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
