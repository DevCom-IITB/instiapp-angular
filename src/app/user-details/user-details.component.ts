import { Component, OnInit } from '@angular/core';
import { IUserProfile, IEvent } from '../interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../data.service';
import { API } from '../../api';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  public profile: IUserProfile;
  public events: IEvent[];
  public error: number;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const userId = params['id'];
      this.dataService.FireGET<IUserProfile>(API.User, {uuid: userId}).subscribe(result => {
        /* Initialize */
        this.events = result.events_going.concat(result.events_interested);
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

}
