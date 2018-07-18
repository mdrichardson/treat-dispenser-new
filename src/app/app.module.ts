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

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SettingsComponent,
    HomeComponent,
    DebugComponent,
    StatusBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
          }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
