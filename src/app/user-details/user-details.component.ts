import { Component, OnInit } from '@angular/core';
import { IUserProfile } from '../interfaces';
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

  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const userId = params['id'];
      this.dataService.FireGET(API.User, {uuid: userId}).subscribe(result => {
        this.profile = result as IUserProfile;
      });
    });
  }

}
