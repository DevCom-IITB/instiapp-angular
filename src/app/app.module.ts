import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MyMaterialClass } from './material-angular.module';

import 'hammerjs';
import { SidebarJSModule } from 'ng-sidebarjs';
import { ImgFallbackModule } from 'ngx-img-fallback';

import { NavmenuComponent } from './navmenu/navmenu.component';
import { FeedComponent } from './feed/feed.component';
import { DataService } from './data.service';
import { EventDetailsComponent } from './event-details/event-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    FeedComponent,
    EventDetailsComponent
  ],
  imports: [
    BrowserModule,

    CommonModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,

    SidebarJSModule.forRoot(),
    ImgFallbackModule,

    RouterModule.forRoot([
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedComponent, data: { state: 'base' } },
      { path: 'event-details/:id', component: EventDetailsComponent, data: { state: 'overlay' } },
      { path: '**', redirectTo: 'feed' }
    ]),

    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    MyMaterialClass,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
