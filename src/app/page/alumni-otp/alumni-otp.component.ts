import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
export const TITLE = 'Alumni OTP';

@Component({
  selector: 'app-alumni-otp',
  templateUrl: './alumni-otp.component.html',
  styleUrls: ['./alumni-otp.component.css'],
})
export class OTPComponent implements OnInit {
  public authenticating = false;
  public error: number;
  public ldap: string;
  otpForm = this.formBuilder.group({
    otp: ''
  });
  constructor(
    public dataService: DataService,
    public route: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
  ) { }

  /** Initialize initial list wiht API call */
  ngOnInit() {
    this.dataService.setTitle('Alumni OTP');
    if (this.dataService.isLoggedIn()) {
      this.router.navigate(['feed']);
      return;
    }
    this.route.url.subscribe( value => {
      this.ldap = value[0].parameters['ldap'];
    });
  }

  verifyOTP(): void {
    this.dataService.SendOTP(this.ldap, this.otpForm.value.otp).subscribe((status) => {
      if (status['error_status'] === false) {
        // performs login
        this.dataService.performLogin();
      } else {
        // displays message
        this.snackBar.open(status['msg'], 'Dismiss', { duration: 2000 });
        if (status['msg'] === 'Wrong OTP, retry') {
          this.router.navigate(['alumni-otp', {ldap: this.ldap}]);
        } else {
          this.router.navigate(['alumni']);
        }
      }
    });
    this.otpForm.reset();
  }

  resendOTP(): void {
    this.dataService.ResendOTP(this.ldap).subscribe((status) => {
      if (status['error_status'] === false) {
        this.router.navigate(['alumni-otp', {ldap: this.ldap}]);
      } else {
        // if latest OTP is invalid now we navigate back to alumni
        this.snackBar.open(status['msg'], 'Dismiss', { duration: 2000 });
        this.router.navigate(['alumni']);
      }
    });
  }
}
