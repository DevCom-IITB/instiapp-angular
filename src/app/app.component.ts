import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit, HostListener } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { DataService } from './data.service';
import { Router, NavigationEnd } from '@angular/router';
import { Helpers } from './helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  public openFlyout = false;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public titleService: Title,
    public dataService: DataService,
    public router: Router,
    public snackBar: MatSnackBar,
    private swUpdate: SwUpdate,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => {
      this.openFlyout = true;
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.titleService.setTitle('InstiApp');
  }

  private toggleSidebar() {
    this.openFlyout = !this.openFlyout;
  }

  ngOnInit() {
    /** Check for update */
    if (environment.production) {
      this.swUpdate.available.subscribe(event => {
        const snackBarRef = this.snackBar.open('New version available!', 'Refresh', {
          duration: 60000,
        });

        /* On clicking refresh */
        snackBarRef.onAction().subscribe(() => {
          this.swUpdate.activateUpdate().then(() => document.location.reload());
        });
      });
      this.swUpdate.checkForUpdate();
    }

    /** Get user (try) */
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.dataService.setInitialized();
    }, (error) => {
      this.dataService.setInitialized();
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
  }

  /** For use after router navigation */
  scrollToTop() {
    window.scrollTo(0, 0);
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
    window.location.href = this.dataService.GetLoginURL();
  }

  /** Handle reaching end of page and sidenav on android chrome */
  @HostListener('window:scroll')
  windowScroll() {
    Helpers.CheckScrollBottom(this.dataService.scrollBottomFunction);
  }
}
