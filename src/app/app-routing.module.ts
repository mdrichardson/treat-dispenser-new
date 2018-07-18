import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { DebugComponent } from './debug/debug.component';

const routes: Routes = [
    {
        path: '',
        component: DebugComponent // Switch to HomeComponent after debugging
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'debug',
        component: HomeComponent // Switch to DebugComponent after drbugging
      },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
