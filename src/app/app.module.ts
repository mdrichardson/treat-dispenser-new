import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { ScheduleTimesComponent } from './schedule/schedule.component';
import { LoginComponent } from './login/login.component';

export const MY_MOMENT_FORMATS = {
    parseInput: 'l LT',
    fullPickerInput: 'l LT',
    datePickerInput: 'l',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SettingsComponent,
    HomeComponent,
    DebugComponent,
    StatusBarComponent,
    ScheduleTimesComponent,
    LoginComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
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
  ],
  providers: [{provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS}],
  bootstrap: [AppComponent]
})
export class AppModule { }
