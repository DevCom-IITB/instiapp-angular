import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { DataService } from './data.service';
import { Router, NavigationEnd } from '@angular/router';
import { Helpers } from './helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  public initialized = false;
  private openFlyout = false;

  /** Hamburger icon to open menu */
  @ViewChild('swipeArea') hamburger: ElementRef;

  private _mobileQueryListener: () => void;

  /** Control top of sidenav with TS on Android Chrome */
  private isAndroidChrome = false;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public titleService: Title,
    public dataService: DataService,
    public router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => {
      this.openFlyout = true;
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.titleService.setTitle('InstiApp');

    /** Check if we are on Chrome-Android */
    if (window.navigator.userAgent.toLowerCase().includes('chrome') &&
        window.navigator.userAgent.toLowerCase().includes('android')) {
        this.isAndroidChrome = true;
    }
  }

  private toggleSidebar() {
    this.openFlyout = !this.openFlyout;
  }

  ngOnInit() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.initialized = true;
    }, (error) => {
      this.initialized = true;
    });

    /* Initialize flyout to open on deskop */
    if (!this.mobileQuery.matches) {
      this.openFlyout = true;
    }
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
    this.router.navigate(['login']);
  }

  /** Handle reaching end of page and sidenav on android chrome */
  @HostListener('window:scroll')
  windowScroll() {
    if (this.isAndroidChrome) {
      document.querySelector('body').style.cssText = '--flyout-top:' + window.document.documentElement.scrollTop + 'px';
    }

    Helpers.CheckScrollBottom(this.dataService.scrollBottomFunction);
  }

  /** Add classes for chrome android */
  getFlyoutClasses() {
    if (this.isAndroidChrome) {
      return ['flyout', 'flyout-chrome-android'];
    }
    return ['flyout'];
  }
}
