import { Component, OnInit, Input } from '@angular/core';
import { IBody, ICommunity } from '../../interfaces';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { Helpers } from '../../helpers';
import { environment } from '../../../environments/environment';
import { API } from '../../../api';


@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.css']
})
export class GroupCardComponent implements OnInit {
  @Input() group: ICommunity;
  @Input() public route: string[];
  constructor(
    public dataService: DataService,
    public router: Router,
  ) { }

  ngOnInit(): void {

    /** Set router link */
    if (!this.route) {
      this.route = ['/group', this.group.id];
    }

  }

  onJoinClicked(): void{
    this.followBody(this.group.body);
  }
  followBody(body: IBody) {
    if (!this.dataService.isLoggedIn()) { alert('Login first!'); return; }
    /* Fire new API! */
    this.dataService.FireGET(API.BodyFollow, {
      uuid: body.id, action: body.user_follows ? 0 : 1
    }).subscribe(() => {
      body.user_follows = !body.user_follows;
      body.followers_count += body.user_follows ? 1 : -1;
    });
  }

  onShareClicked(): void{
    Helpers.NativeShare(this.group.name, `Check out the ${this.group.name} community at InstiApp!`, this.getGroupUrl());
  }


  getGroupUrl(): string{
    return  `${environment.host}org/${this.group.str_id}`;
  }
}
