import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-redir',
  templateUrl: './redir.component.html'
})
export class RedirComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    switch (this.route.snapshot.routeConfig.path.toLowerCase()) {
      case 'feedback': {
        window.location.href = 'https://goo.gl/forms/ne3uMishA9zcn6aN2';
        break;
      }
      case 'android': {
        window.location.href = 'https://play.google.com/store/apps/details?id=app.insti';
        break;
      }
    }
  }

}
