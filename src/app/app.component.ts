import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { DataService } from './data.service';
import { routerTransition } from './animations';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ routerTransition ],
})
export class AppComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
    public initialized = false;
    @ViewChild('swipeArea') hamburger: ElementRef;

    private _mobileQueryListener: () => void;

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private titleService: Title,
        public dataService: DataService,
        public router: Router,
      ) {

        this.mobileQuery = media.matchMedia('(max-width: 767px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.titleService.setTitle('Home');
    }

    ngOnInit() {
    }

    scrollToTop() {
      window.scrollTo(0, 0);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    getState(outlet) {
      return outlet.activatedRouteData.state;
    }

    clickHamburger() {
      const el: HTMLElement = this.hamburger.nativeElement as HTMLElement;
      el.click();
    }
}
