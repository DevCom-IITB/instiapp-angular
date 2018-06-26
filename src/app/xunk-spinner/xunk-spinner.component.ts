import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-xunk-spinner',
  templateUrl: './xunk-spinner.component.html',
  styleUrls: ['./xunk-spinner.component.css']
})
export class XunkSpinnerComponent {

  /** Set to true to display error message */
  @Input() public error;

  SAD_CLOUD = '/assets/sadcloud.svg';
  errors = {
    204: { img: this.SAD_CLOUD, m: 'Nothing to show here' },
    400: { img: this.SAD_CLOUD, m: 'That didn\'t make sense' },
    404: { img: this.SAD_CLOUD, m: 'Couldn\'t find that anywhere\nSure you\'re in the right place?' },
    500: { img: this.SAD_CLOUD, m: 'Sorry, couldn\'t get that\nSomething went wrong on our side' },
    1000: { img: this.SAD_CLOUD, m: 'Something went really wrong!' },
  };

  constructor() { }

  getError() {
    if (!this.error) { return { img: '', m: ''}; }
    if (this.error in this.errors) {
      return this.errors[this.error];
    } else {
      return this.errors[1000];
    }
  }

}
