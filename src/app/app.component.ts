import { ChangeDetectorRef, Component, OnDestroy, OnInit, HostListener, NgZone } from '@angular/core';
import { DataService } from './data.service';
import { Router, NavigationEnd } from '@angular/router';
import { Helpers } from './helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { INotification } from './interfaces';
import { API } from '../api';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NotifyCardComponent } from './card/notify-card/notify-card.component';
import { WinRT } from './windows';

const TITLE = 'InstiApp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  mobileQuery: any;
  public openFlyout = false;
  public _title = TITLE;
  public isSandbox = false;
  public previousScrollTop = 0;

  private _mobileQueryListener: () => void;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public dataService: DataService,
    public router: Router,
    public snackBar: MatSnackBar,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private bottomSheet: MatBottomSheet,
    public zone: NgZone,
  ) {
    /* Open flyout on screen type change */
    this.mobileQuery = window.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => {
      this.openFlyout = true;
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);

    /* Initialize if we are in WinRT */
    WinRT.init();

    /* Check if this is a fake environment */
    const sandbox = Helpers.getParameterByName('sandbox');
    if (sandbox && sandbox === 'true') {
      this.isSandbox = true;
      this.dataService.isSandbox = true;
    }

    /* Mark notification as read if followed */
    const notifid = Helpers.getParameterByName('notif');
    if (notifid && notifid !== null && notifid !== '') {
      const sub = this.dataService.loggedInObservable.subscribe(status => {
        if (status) {
          this.dataService.FireGET(API.NotificationRead, { id: notifid }).subscribe();
          sub.unsubscribe();
        }
      });
    }

    /* Check if sessionid is passed as a query parameter */
    const sessid = Helpers.getParameterByName('sessionid');
    if (sessid) {
      document.cookie = `sessionid=${sessid}; path=/`;
    }

    /** Expose to the world */
    window['angularAppComponentRef'] = this;
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
      if (!this.isSandbox && !WinRT.is()) {
        /* Show a prompt to update */
        this.swUpdate.available.subscribe(() => {
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
    this.dataService.GetFillCurrentUser().subscribe(() => {
      this.dataService.setInitialized();
    }, () => {
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
    /* Try to get existing subscription */
    this.swPush.subscription.subscribe((sub: PushSubscription) => {
      if (sub === null ) {
        /* No subscription found */
        this.requestNotificationSubscription();
      } else {
        /* (Re)Notify the server */
        this.dataService.FirePOST(API.WebPushSubscribe, sub).subscribe();
      }
    });
  }

  /** Request a new notifications subscription */
  requestNotificationSubscription() {
    this.swPush.requestSubscription({
      serverPublicKey: environment.VAPID_PUBLIC_KEY
    }).then(sub => {
      this.dataService.FirePOST(API.WebPushSubscribe, sub).subscribe();
    })
    .catch(err => console.error('Could not subscribe to notifications', err));
  }

  /** Unsubscribe from listeners */
  ngOnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);

      /* Remove the context */
      window['angularAppComponentRef'] = null;
  }

  /** Gets if the current router outlet state is `base` or `overlay` */
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  /** Close sidebar only for mobile */
  closeSidebarMobile() {
    if (this.mobileQuery.matches) { this.toggleSidebar(); }
  }

  /** Redirects to Google login */
  glogin() {
    if (!this.router.url.includes('login')) {
      const path = [this.router.url];
      localStorage.setItem(this.dataService.LOGIN_REDIR, this.dataService.EncodeObject(path));
    }
    const endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const clientid = '283642720122-426e6bgmqi7hbh6pf1q2jjsbee4o2lh1.apps.googleusercontent.com';
    const redir = 'http://localhost:4200/glogin';
    const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid';

    window.location.href = `${endpoint}?client_id=${clientid}&response_type=code&scope=${scope}&redirect_uri=${redir}`;
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

  /** Navigate to a URL (exposed) */
  extNavigateURL(url: string): void {
    this.zone.run(() => {
      this.router.navigateByUrl(url);
    });
  }
}
