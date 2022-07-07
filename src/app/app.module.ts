// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouteReuseStrategy } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTabsModule } from '@angular/material/tabs';

// Basic app imports
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Dependencies
import 'hammerjs';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { MarkdownModule } from 'ngx-markdown';
import { FlyoutModule } from 'ngx-flyout-ivy';

// Extra modules
import { CustomReuseStrategy } from './routing';
import { MyMaterialClass } from './material-angular.module';
import { LoginActivate } from './loginactivate';

// Services
import { DataService } from './data.service';

// Pages
import { FeedComponent } from './page/feed/feed.component';
import { EventDetailsComponent } from './page/event-details/event-details.component';
import { CalendarComponent } from './page/calendar/calendar.component';
import { AddEventComponent } from './page/add-event/add-event.component';
import { UserDetailsComponent } from './page/user-details/user-details.component';
import { BodyDetailsComponent } from './page/body-details/body-details.component';
import { UpdateBodyComponent } from './page/update-body/update-body.component';
import { BlogComponent } from './page/blog/blog.component';
import { NewsComponent } from './page/news/news.component';
import { ExploreComponent } from './page/explore/explore.component';
import { MessComponent } from './page/mess/mess.component';
import { MapComponent } from './page/map/map.component';
import { QuickLinksComponent } from './page/quick-links/quick-links.component';
import { SettingsComponent } from './page/settings/settings.component';
import { AboutComponent } from './page/settings/about/about.component';
import { AchievementsComponent } from './page/achievements/achievements.component';
import { AlumniComponent } from './page/alumni-login/alumni-login.component';
import { OTPComponent } from './page/alumni-otp/alumni-otp.component';
import { QuerySearchComponent } from './page/query-search/query-search.component';

// Cards
import { CardComponent } from './card/card.component';
import { EventCardComponent } from './card/event-card/event-card.component';
import { BodyCardComponent } from './card/body-card/body-card.component';
import { UserCardComponent } from './card/user-card/user-card.component';
import { NotifyCardComponent } from './card/notify-card/notify-card.component';
import { InterestCardComponent } from './card/interest-card/interest-card.component';
import { CommunityPostCardComponent } from './card/communitypost-card/communitypost-card.component';

// Components
import { ListLoadingComponent } from './comp/list-loading/list-loading.component';
import { XunkSpinnerComponent } from './comp/xunk-spinner/xunk-spinner.component';
import { RedirComponent } from './comp/redir/redir.component';
import { UpdateRoleComponent } from './comp/update-role/update-role.component';
import { LoginComponent } from './comp/login/login.component';

// Layout components
import { EventSidebarDesktopComponent } from './layout/event-sidebar-desktop/event-sidebar-desktop.component';
import { DesktopSplitComponent } from './layout/desktop-split/desktop-split.component';
import { NavmenuComponent } from './layout/navmenu/navmenu.component';
import { AchievementRequestComponent } from './page/achievements/achievement-request/achievement-request.component';
import { AchievementNewComponent } from './page/achievements/achievement-new/achievement-new.component';
import { QueryNewComponent } from './page/query-search/query-new/query-new.component';
import { SearchBoxComponent } from './comp/search-box/search-box.component';
import { AchievementCardComponent } from './card/achievement-card/achievement-card.component';
import { AchievementOfferMakeComponent } from './page/achievements/achievement-offer-make/achievement-offer-make.component';
import { SkillsNewComponent } from './page/achievements/skills-new/skills-new.component';
import { QrScanComponent } from './page/qr-scan/qr-scan.component';
import { DiscussionsComponent } from './page/discussions/discussions.component';
import { GroupCardComponent } from './card/group-card/group-card.component';
import { PostCardComponent } from './card/post-card/post-card.component';
import { AddPostComponent } from './page/add-post/add-post.component';
import { GroupFeedComponent } from './page/discussions/group-feed/group-feed.component';
import { GroupDetailsComponent } from './page/group-details/group-details.component';
import { PostViewComponent } from './page/discussions/post-view/post-view.component';
import { DesktopSplitDynamicComponent } from './layout/desktop-split-dynamic/desktop-split-dynamic.component';

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
    CommunityPostCardComponent,
    BodyDetailsComponent,
    UserCardComponent,
    UpdateBodyComponent,
    SkillsNewComponent,
    BlogComponent,
    EventSidebarDesktopComponent,
    NewsComponent,
    ListLoadingComponent,
    XunkSpinnerComponent,
    ExploreComponent,
    MessComponent,
    MapComponent,
    QuickLinksComponent,
    SettingsComponent,
    AboutComponent,
    DesktopSplitComponent,
    NotifyCardComponent,
    RedirComponent,
    UpdateRoleComponent,
    CardComponent,
    InterestCardComponent,
    AchievementsComponent,
    AchievementRequestComponent,
    AchievementNewComponent,
    SearchBoxComponent,
    GroupDetailsComponent,

    AchievementCardComponent,
    GroupCardComponent,
    AchievementOfferMakeComponent,
    QrScanComponent,
    AlumniComponent,
    OTPComponent,
    QuerySearchComponent,
    QueryNewComponent,
    DiscussionsComponent,
    PostCardComponent,
    AddPostComponent,
    GroupFeedComponent,
    PostViewComponent,
    DesktopSplitDynamicComponent,
  ],
  imports: [
    BrowserModule,

    MatTabsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,

    ImgFallbackModule,
    MarkdownModule.forRoot(),
    FlyoutModule,

    RouterModule.forRoot([
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedComponent, data: { state: 'base' } },
      { path: 'news', component: NewsComponent, data: { state: 'base' } },
      { path: 'calendar', component: CalendarComponent, data: { state: 'base' } },
      { path: 'explore', component: ExploreComponent, data: { state: 'base' } },
      { path: 'mess', component: MessComponent, data: { state: 'base' } },

      { path: 'map', component: MapComponent, data: { state: 'base' } },
      { path: 'map/:name', component: MapComponent, data: { state: 'base' } },

      { path: 'achievements', component: AchievementsComponent, data: { state: 'base' }, canActivate: [LoginActivate] },
      { path: 'achievements/:body', component: AchievementsComponent, data: { state: 'base' }, canActivate: [LoginActivate] },
      { path: 'achievement-new', component: AchievementNewComponent, data: { state: 'base' }, canActivate: [LoginActivate] },
      { path: 'achievement-new/:offer', component: AchievementNewComponent, data: { state: 'base' }, canActivate: [LoginActivate] },
      { path: 'qr-scan', component: QrScanComponent, data: { state: 'base' } },

      { path: 'quick-links', component: QuickLinksComponent, data: { state: 'base' } },
      { path: 'settings', component: SettingsComponent, data: { state: 'base' } },
      { path: 'about', component: AboutComponent, data: { state: 'overlay' } },

      { path: 'add-event', component: AddEventComponent, data: { state: 'overlay' }, canActivate: [LoginActivate] },
      { path: 'edit-event/:id', component: AddEventComponent, data: { state: 'overlay' }, canActivate: [LoginActivate] },
      { path: 'edit-body/:id', component: UpdateBodyComponent, data: { state: 'overlay' }, canActivate: [LoginActivate] },

      { path: 'event/:id', component: EventDetailsComponent, data: { state: 'overlay' } },
      { path: 'user/:id', component: UserDetailsComponent, data: { state: 'overlay' } },
      { path: 'org/:id', component: BodyDetailsComponent, data: { state: 'overlay' } },

      { path: 'query-search', component: QuerySearchComponent, data: { state: 'base' } },
      { path: 'query-new', component: QueryNewComponent, data: { state: 'base' }, canActivate: [LoginActivate] },

      { path: 'discussions', component: DiscussionsComponent, data: { state: 'base' } },
      { path: 'group/:id', component: GroupDetailsComponent, data: { state: 'overlay' } },
      { path: 'add-post', component: AddPostComponent, data: { state: 'base' } },
      { path: 'group-feed/:id', component: GroupFeedComponent, data: { state: 'base' } },
      { path: 'view-post/:id', component: PostViewComponent, data: { state: 'base'}},

      { path: 'blog/:blog', component: BlogComponent, data: { state: 'base' }, canActivate: [LoginActivate] },
      { path: 'login', component: LoginComponent, data: { state: 'base' } },
      { path: 'alumni', component: AlumniComponent, data: { state: 'base' } },
      { path: 'alumni-otp', component: OTPComponent, data: { state: 'base' } },
      { path: 'feedback', component: RedirComponent, data: { state: 'base' } },
      { path: 'android', component: RedirComponent, data: { state: 'base' } },
      { path: '**', redirectTo: 'feed' },
    ]),

    ServiceWorkerModule.register(environment.service_worker_url, { enabled: environment.production }),
    MyMaterialClass,
    LayoutModule,
  ],
  entryComponents: [
    NotifyCardComponent
  ],
  providers: [
    DataService,
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    LoginActivate,

  ],
  bootstrap: [AppComponent,
    QuerySearchComponent]
})
export class AppModule { }
