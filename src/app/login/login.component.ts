import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /** Open a new tab for SSO login */
  login() {
    const HOST = 'https://gymkhana.iitb.ac.in/sso/oauth/authorize/';
    const CLIENT_ID = 'vR1pU7wXWyve1rUkg0fMS6StL1Kr6paoSmRIiLXJ';
    const RESPONSE_TYPE = 'code';
    const SCOPE = 'basic profile picture sex ldap phone insti_address program secondary_emails';
    const REDIR = 'http://localhost:8000/api/login';

    const URL = HOST + '?client_id=' + CLIENT_ID +
                       '&response_type=' + RESPONSE_TYPE +
                       '&scope=' + SCOPE +
                       '&redirect_uri=' + REDIR;

    window.open(URL, '_blank');
  }

}
