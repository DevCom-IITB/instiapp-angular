import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { API } from '../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
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
    ldap: ''
  });
  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.dataService.setTitle('Alumni Login');
    if (this.dataService.isLoggedIn()) {
      this.router.navigate(['feed']);
      return;
    }
  }

  redirToOTP(): void {
    this.dataService.SendLDAP(this.ldapForm.value.ldap).subscribe((value)=>{
      if (value['exist'] == false) {
        this.snackBar.open(value['msg'], 'Dismiss', { duration: 2000});
        this.router.navigate(['alumni'])
      }
      else {
        // OTP already sent before
        if (value['msg'] != 'fine') {
          this.snackBar.open(value['msg'], 'Dismiss', { duration: 2000});
        }
        this.router.navigate(['alumni-otp', {ldap: value['ldap']}]);
      }
    })
    this.ldapForm.reset();
  }
}
