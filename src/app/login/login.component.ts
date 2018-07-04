import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /** Currently authenticating */
  public authenticating = false;

  public error;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public router: Router,
  ) { }

  ngOnInit() {
    if (this.dataService.isLoggedIn()) {
      this.router.navigate(['feed']);
      return;
    }

    const params = this.activatedRoute.snapshot.queryParams;
    if (params.hasOwnProperty('code')) {
      this.authenticating = true;
      const auth_code = params['code'];
      this.dataService.AuthenticateSSO(auth_code).subscribe(() => {
        this.dataService.GetFillCurrentUser().subscribe(user => {
          const redir = localStorage.getItem(this.dataService.LOGIN_REDIR);
          if (redir && redir !== '') {
            localStorage.setItem(this.dataService.LOGIN_REDIR, '');
            const rpath: any[] = this.dataService.DecodeObject(redir);
            this.router.navigate(rpath);
          } else {
            this.router.navigate(['feed']);
          }
        });
      }, (e) => {
        console.log(e);
        this.error = e.status;
      });
    } else {
      this.authenticating = false;
    }
  }

  /** Open a new tab for SSO login */
  login() {
    window.location.href = this.dataService.GetLoginURL();
  }
}
