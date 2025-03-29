import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { UntypedFormBuilder } from '@angular/forms';
export const TITLE = 'Alumni Login';

@Component({
  selector: 'app-alumni-login',
  templateUrl: './alumni-login.component.html',
  styleUrls: ['./alumni-login.component.css'],
})
export class AlumniComponent implements OnInit {
  public authenticating = false;
  public error: number;
  ldapForm = this.formBuilder.group({
    ldap: '',
  });
  constructor(
    public router: Router,
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public formBuilder: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dataService.setTitle('Alumni Login');
    if (this.dataService.isLoggedIn()) {
      this.router.navigate(['feed']);
      return;
    }
  }

  redirToOTP(): void {
    this.authenticating = true;
    this.dataService.SendLDAP(this.ldapForm.value.ldap).subscribe((value) => {
      if (value['exist'] === false) {
        // display error with ldap
        this.snackBar.open(value['msg'], 'Dismiss', { duration: 2000 });
        this.router.navigate(['alumni']);
      } else {
        // OTP already sent before
        if (value['msg'] !== 'fine') {
          this.snackBar.open(value['msg'], 'Dismiss', { duration: 2000 });
        }
        this.router.navigate(['alumni-otp', { ldap: value['ldap'] }]);
      }
      this.authenticating = false;
    });
    this.ldapForm.reset();
  }
}
