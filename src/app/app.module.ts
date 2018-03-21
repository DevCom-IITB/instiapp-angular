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
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './routing';

import { XunkCalendarModule } from 'xunk-calendar';

import { NavmenuComponent } from './navmenu/navmenu.component';
import { FeedComponent } from './feed/feed.component';
import { DataService } from './data.service';
import { EventDetailsComponent } from './event-details/event-details.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AddEventComponent } from './add-event/add-event.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    FeedComponent,
    EventDetailsComponent,
    CalendarComponent,
    AddEventComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,

    CommonModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,

    SidebarJSModule.forRoot(),
    ImgFallbackModule,

    XunkCalendarModule,

    RouterModule.forRoot([
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedComponent, data: { state: 'base' } },
      { path: 'event-details/:id', component: EventDetailsComponent, data: { state: 'overlay' } },
      { path: 'calendar', component: CalendarComponent, data: { state: 'base' } },
      { path: 'add-event', component: AddEventComponent, data: { state: 'overlay' } },
      { path: 'edit-event/:id', component: AddEventComponent, data: { state: 'overlay' } },
      { path: 'login', component: LoginComponent, data: { state: 'overlay' } },
      { path: '**', redirectTo: 'feed' }
    ]),

    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    MyMaterialClass,
  ],
  providers: [
    DataService,
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
