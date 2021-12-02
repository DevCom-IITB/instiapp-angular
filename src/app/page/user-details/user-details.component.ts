import { Component, OnInit, Self } from '@angular/core';
import { IUserProfile, IEvent, IInterest } from '../../interfaces';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { API } from '../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  interest: IInterest;
  public profile: IUserProfile;
  public events: IEvent[];
  public error: number;

  interests: IInterest[];





  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }

  ngOnInit() {
    this.interest = {} as IInterest;
    this.activatedRoute.params.subscribe((params: Params) => {
      const userId = params['id'];
      this.dataService.FireGET<IUserProfile>(API.User, { uuid: userId }).subscribe(result => {
        /* Initialize */
        this.events = result.events_going.concat(result.events_interested);
        this.interests = result.interests;
        console.log(this.interests)
        result.former_roles.forEach(r => r.name = `Former ${r.name} ${r.year}`);
        result.roles = result.roles.concat(result.former_roles);
        this.dataService.setTitle(result.name);

        /* Set fallback image */
        if (!result.profile_pic || result.profile_pic === '') {
          result.profile_pic = 'assets/useravatar.svg';
        }

        /* Show the user */
        this.profile = result;
      }, (e) => {
        this.error = e.status;
      });
    });
  }

  hasField(field: string) {
    return this.profile[field] && this.profile[field].toUpperCase() !== 'N/A';
  }


  setInterest(event: any): void {

    if (event.option) {
      console.log(event.option.value.title)
      // console.log(this.interest)
      this.interest.title = event.option.value.title;
      this.interest.id = event.option.value.id;
      console.log(event.option.value)

      // this.dataService.FirePOST(API.Interest, event.option.value.id).subscribe(() => {
      //   this.snackBar.open('Your request has been recorded', 'Dismiss', { duration: 2000 });
      //   this.interest = {} as IInterest;
      //   this.router.navigate(['/user-details']);
      // }, err => {
      //   this.snackBar.open(`There was ank error: ${err.message}`, 'Dismiss');
      // });

      this.dataService.FirePOST(API.Interest, this.interest).subscribe(() => {

        this.snackBar.open('Your request has been recorded', 'Dismiss', { duration: 2000 });
        this.interest = {} as IInterest;
      }, err => {
        console.log(this.interest.id)
        this.snackBar.open(`There was harsh error: ${err.message}`, 'Dismiss');

      });
    }
  }

  // fire a request to add this interest as a interest of the loged in user
}



