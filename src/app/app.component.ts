import { ChangeDetectorRef, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { DataService } from './data.service';
import { Router, NavigationEnd } from '@angular/router';
import { Helpers } from './helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { INotification } from './interfaces';
import { API } from '../api';
import { MatBottomSheet } from '@angular/material';
import { NotifyCardComponent } from './notify-card/notify-card.component';

const TITLE = 'InstiApp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  public openFlyout = false;
  public _title = TITLE;
  public isSandbox = false;
  public previousScrollTop = 0;

  private _mobileQueryListener: () => void;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dataService: DataService,
    public router: Router,
    public snackBar: MatSnackBar,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private bottomSheet: MatBottomSheet,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => {
      this.openFlyout = true;
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);

    /* Check if this is a fake environment */
    const sandbox = Helpers.getParameterByName('sandbox');
    if (sandbox && sandbox === 'true') {
      this.isSandbox = true;
      this.dataService.isSandbox = true;
    }
  }

  private toggleSidebar() {
    this.openFlyout = !this.openFlyout;
  }

  ngOnInit() {
    /* Initialize stuff for title */
    this.dataService.titleObservable.subscribe((title) => {
      this._title = title;
      this.changeDetectorRef.detectChanges();
    });

    /** Check for update */
    if (environment.production) {
      if (!this.isSandbox) {
        /* Show a prompt to update */
        this.swUpdate.available.subscribe(event => {
          const snackBarRef = this.snackBar.open('New version available!', 'Refresh', {
            duration: 60000,
          });

          /* On clicking refresh */
          snackBarRef.onAction().subscribe(() => {
            this.swUpdate.activateUpdate().then(() => document.location.reload());
          });
        });
      }
      /* Check for new versions */
      this.swUpdate.checkForUpdate();
    }

    /** Get user (try) */
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.dataService.setInitialized();
    }, (error) => {
      this.dataService.setInitialized();
    });

    /** Get notifications */
    this.dataService.loggedInObservable.subscribe(status => {
      const DEFAULT_IMAGE = '/assets/logo.png';

      if (status) {
        this.dataService.FireGET<INotification[]>(API.Notifications).subscribe(result => {
          for (const notification of result) {
            if (notification.actor_type.includes('event')) {
              notification.title = notification.actor.name;
              notification.image_url = notification.actor.image_url || notification.actor.bodies[0].image_url;
            } else if (notification.actor_type.includes('newsentry')) {
              notification.title = notification.actor.title;
              notification.image_url = notification.actor.body.image_url;
            } else if (notification.actor_type.includes('blogentry')) {
              notification.title = notification.actor.title;
              notification.image_url = DEFAULT_IMAGE;
            }
          }
          this.dataService.notifications = result;
        });
      }
    });

    /* Initialize flyout to open on deskop */
    if (!this.mobileQuery.matches) {
      this.openFlyout = true;
    }

    /* Scroll to top on route change */
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });

    /* Subscribe on login */
    const lis = this.dataService.loggedInObservable.subscribe(status => {
      if (status && this.swUpdate.isEnabled) {
        this.subscribeNotifications();
        lis.unsubscribe();
      }
    });
  }

  /** Subscribe to push notifications */
  subscribeNotifications() {
    /* Push notifications */
    this.swPush.requestSubscription({
      serverPublicKey: environment.VAPID_PUBLIC_KEY
    })
    .then(sub => {
      console.log(JSON.stringify(sub));
      this.dataService.FirePOST(API.WebPushSubscribe, sub).subscribe();
    })
    .catch(err => console.error('Could not subscribe to notifications', err));
  }

  /** Unsubscribe from listeners */
  ngOnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  /** Gets if the current router outlet state is `base` or `overlay` */
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  /** Close sidebar only for mobile */
  closeSidebarMobile() {
    if (this.mobileQuery.matches) { this.toggleSidebar(); }
  }

  /** Redirects to login */
  login() {
    if (!this.router.url.includes('login')) {
      const path = [this.router.url];
      localStorage.setItem(this.dataService.LOGIN_REDIR, this.dataService.EncodeObject(path));
    }
    window.location.href = this.dataService.GetLoginURL();
  }

  /** Handle reaching end of page and sidenav on android chrome */
  @HostListener('window:scroll')
  windowScroll() {
    const top = Helpers.CheckScrollBottom(this.dataService.scrollBottomFunction);
    this.dataService.setScrollingDown(top > this.previousScrollTop);
    this.previousScrollTop = top;
  }

  /** Open notifications sheet */
  openNotifications() {
    this.bottomSheet.open(NotifyCardComponent);
  }
}
