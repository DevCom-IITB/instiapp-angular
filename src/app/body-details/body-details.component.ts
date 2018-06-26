import { Component, OnInit } from '@angular/core';
import { IBody } from '../interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../data.service';
import { API } from '../../api';
import { Helpers } from '../helpers';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-body-details',
  templateUrl: './body-details.component.html',
  styleUrls: ['./body-details.component.css']
})
export class BodyDetailsComponent implements OnInit {

  public body: IBody;
  public bodyId: string;
  public shareShowing = false;
  public error: number;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.bodyId = params['id'];
      this.refresh();
    });
  }

  /** Handles click of follow button */
  markFollow(e) {
    if (!this.dataService.isLoggedIn()) { alert('Login first!'); return; }
    /* Fire new API! */
    this.dataService.FireGET(API.BodyFollow, {
      uuid: this.body.id, action: this.body.user_follows ? 0 : 1
    }).subscribe(result => {
      this.body.user_follows = !this.body.user_follows;
    });
  }

  /** Call the bodies API and show data */
  refresh() {
    this.dataService.FireGET(API.Body, {uuid: this.bodyId}).subscribe(result => {
      this.body = result as IBody;
    }, (e) => {
      this.error = e.status;
    });
  }

  /** Trigger the native share or show share buttons */
  share() {
    if (!Helpers.NativeShare(
        this.body.name, `Check out ${this.body.name} at InstiApp!`, `${environment.host}org/${this.body.str_id}`)) {
      this.shareShowing = !this.shareShowing;
    }
  }

}
