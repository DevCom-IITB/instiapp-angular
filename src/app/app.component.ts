import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { DataService } from './data.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  public initialized = false;

  /** Hamburger icon to open menu */
  @ViewChild('swipeArea') hamburger: ElementRef;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public titleService: Title,
    public dataService: DataService,
    public router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.titleService.setTitle('IITB App');
  }

  ngOnInit() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.initialized = true;
    }, (error) => {
      this.initialized = true;
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

  /** Emulate a click on the hamburger button */
  clickHamburger() {
    const el: HTMLElement = this.hamburger.nativeElement as HTMLElement;
    el.click();
  }

  /** Redirects to login */
  login() {
    this.router.navigate(['login']);
  }

}
