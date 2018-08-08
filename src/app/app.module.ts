import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { DebugComponent } from './debug/debug.component';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { NotifierModule } from 'angular-notifier';
import { OwlDateTimeModule, OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { ScheduleTimesComponent } from './schedule/schedule.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { JwtModule } from '@auth0/angular-jwt';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ContactComponent } from './contact/contact.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

export const MY_MOMENT_FORMATS = {
    parseInput: 'l LT',
    fullPickerInput: 'l LT',
    datePickerInput: 'l',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

export function tokenGetter() {
    return localStorage.getItem('token');
} 

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SettingsComponent,
    HomeComponent,
    DebugComponent,
    StatusBarComponent,
    ScheduleTimesComponent,
    LoginComponent,
    ContactComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
        config: {
          tokenGetter,
          whitelistedDomains: ['127.0.0.1:443', 'treat.mdrichardson.net'],
          blacklistedRoutes: ['127.0.0.1:8100', 'api.particle.io', 'vid.mdrichardson.net']
        }
      }),
    NotifierModule.withConfig({
        position: {
            horizontal: {
              position: 'right',
              distance: 12
            },
            vertical: {
              position: 'top',
              distance: 12,
              gap: 10
            }
          },
        behaviour: {
            autoHide: 2500,
            onClick: 'hide',
            onMouseover: 'pauseAutoHide',
            showDismissButton: true,
            stacking: 2
          },
    }),
    OwlDateTimeModule, 
    OwlMomentDateTimeModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [{provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS}, AuthGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
