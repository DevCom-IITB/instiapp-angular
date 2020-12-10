import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-xunk-spinner',
  templateUrl: './xunk-spinner.component.html',
  styleUrls: ['./xunk-spinner.component.css']
})
export class XunkSpinnerComponent implements OnInit, OnChanges, OnDestroy {

  /** Set to true to display error message */
  @Input() public error;

  SAD_CLOUD = '/assets/sadcloud.svg';
  errors = {
    204: { img: this.SAD_CLOUD, m: 'Nothing to show here' },
    400: { img: this.SAD_CLOUD, m: 'That didn\'t make sense' },
    401: { img: this.SAD_CLOUD, m: 'Unauthorized\nYou need to login for that!' },
    403: { img: this.SAD_CLOUD, m: 'Forbidden\nYou can\'t do that!' },
    404: { img: this.SAD_CLOUD, m: 'Couldn\'t find that anywhere\nSure you\'re in the right place?' },
    408: { img: this.SAD_CLOUD, m: 'Timeout\nSomething isn\' right!' },
    500: { img: this.SAD_CLOUD, m: 'Sorry, couldn\'t get that\nSomething went wrong on our side' },
    504: { img: this.SAD_CLOUD, m: 'Gateway Timeout\nSomething went really wrong!' },
    1000: { img: this.SAD_CLOUD, m: 'Something went really wrong!' },
  };

  constructor() { }

  ngOnInit() {
    if (!this.error) {
      this.pushSpinner();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.error?.currentValue) {
      this.popSpinner();
    } else {
      this.pushSpinner();
    }
  }

  ngOnDestroy() {
    this.popSpinner();
  }

  pushSpinner() {
    if (!(<any>window).instiAppGlobalSpinnerStack) {
      (<any>window).instiAppGlobalSpinnerStack = [];
    }

    if ((<any>window).instiAppGlobalSpinnerStack.indexOf(this) !== -1) return;
    (<any>window).instiAppGlobalSpinnerStack.push(this);
    document.getElementById('instiapp-global-spinner').style.visibility = 'visible';
  }

  popSpinner() {
    const i = (<any>window).instiAppGlobalSpinnerStack?.indexOf(this) ?? -1;
    if (i === -1) return;
    (<any>window).instiAppGlobalSpinnerStack.splice(i , 1);
    if ((<any>window).instiAppGlobalSpinnerStack.length === 0) {
      document.getElementById('instiapp-global-spinner').style.visibility = 'hidden';
    }
  }

  getError() {
    if (!this.error) { return { img: '', m: ''}; }
    if (this.error in this.errors) {
      return this.errors[this.error];
    } else {
      return this.errors[1000];
    }
  }

}
