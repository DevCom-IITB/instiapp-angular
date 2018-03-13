import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MyMaterialClass } from './material-angular.module';

import 'hammerjs';
import { NavmenuComponent } from './navmenu/navmenu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent
  ],
  imports: [
    BrowserModule,

    CommonModule,
    HttpClientModule,
    FormsModule,

    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }
    ]),

    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    MyMaterialClass,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
