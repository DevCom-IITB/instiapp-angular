import { Component, OnInit } from '@angular/core';
import { IBody } from '../../interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../data.service';
import { API } from '../../../api';
import { Helpers } from '../../helpers';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-body-details',
    templateUrl: './body-details.component.html',
    styleUrls: ['./body-details.component.css'],
    standalone: false
})
export class BodyDetailsComponent implements OnInit {

  public body: IBody;
  public bodyId: string;
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
  markFollow() {
    if (!this.dataService.isLoggedIn()) { alert('Login first!'); return; }
    /* Fire new API! */
    this.dataService.FireGET(API.BodyFollow, {
      uuid: this.body.id, action: this.body.user_follows ? 0 : 1
    }).subscribe(() => {
      this.body.user_follows = !this.body.user_follows;
      this.body.followers_count += this.body.user_follows ? 1 : -1;
    });
  }

  /** Call the bodies API and show data */
  refresh() {
    this.dataService.FireGET<IBody>(API.Body, {uuid: this.bodyId}).subscribe(result => {
      Helpers.preloadImage(result.image_url, () => {
        this.body = result;
      });
      this.dataService.setTitle(result.name);
    }, (e) => {
      this.error = e.status;
    });
  }

  /** Trigger the native share or show share prompt */
  share() {
    Helpers.NativeShare(this.body.name, `Check out ${this.body.name} at InstiApp!`, this.shareUrl());
  }

  /** Get the sharing url */
  shareUrl(): string {
    return  `${environment.host}org/${this.body.str_id}`;
  }

}
