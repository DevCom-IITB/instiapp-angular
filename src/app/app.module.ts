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
import { ShareButtonModule } from '@ngx-share/button';

import { NavmenuComponent } from './navmenu/navmenu.component';
import { FeedComponent } from './feed/feed.component';
import { DataService } from './data.service';
import { EventDetailsComponent } from './event-details/event-details.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AddEventComponent } from './add-event/add-event.component';
import { LoginComponent } from './login/login.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { EventCardComponent } from './event-card/event-card.component';
import { BodyCardComponent } from './body-card/body-card.component';
import { BodyDetailsComponent } from './body-details/body-details.component';
import { UserCardComponent } from './user-card/user-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    FeedComponent,
    EventDetailsComponent,
    CalendarComponent,
    AddEventComponent,
    LoginComponent,
    UserDetailsComponent,
    EventCardComponent,
    BodyCardComponent,
    BodyDetailsComponent,
    UserCardComponent
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
    ShareButtonModule.forRoot(),

    RouterModule.forRoot([
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedComponent, data: { state: 'base' } },
      { path: 'event-details/:id', component: EventDetailsComponent, data: { state: 'overlay' } },
      { path: 'calendar', component: CalendarComponent, data: { state: 'base' } },
      { path: 'add-event', component: AddEventComponent, data: { state: 'overlay' } },
      { path: 'edit-event/:id', component: AddEventComponent, data: { state: 'overlay' } },
      { path: 'user-details/:id', component: UserDetailsComponent, data: { state: 'overlay' } },
      { path: 'body-details/:id', component: BodyDetailsComponent, data: { state: 'overlay' } },
      { path: 'login', component: LoginComponent, data: { state: 'overlay' } },
      { path: '**', redirectTo: 'feed' },
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
