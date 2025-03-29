import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {
  /** Currently authenticating */
  public authenticating = false;

  public error;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public router: Router
  ) {}

  ngOnInit() {
    this.dataService.setTitle('Login');
    if (this.dataService.isLoggedIn()) {
      this.router.navigate(['feed']);
      return;
    }

    const params = this.activatedRoute.snapshot.queryParams;
    if (params.hasOwnProperty('code')) {
      this.authenticating = true;
      const auth_code = params['code'];
      this.dataService.AuthenticateSSO(auth_code).subscribe(
        (res) => {
          localStorage.setItem(this.dataService.SESSION_ID, res['sessionid']);
          document.cookie = `sessionid=${res['sessionid']}; path=/`;
          this.dataService.performLogin();
        },
        (e) => {
          this.error = e.status;
        }
      );
    } else {
      this.authenticating = false;
    }
  }

  /** Open a new tab for SSO login */
  login() {
    window.location.href = this.dataService.GetLoginURL();
  }
}
