import { Component, OnInit } from '@angular/core';
import { IBody } from '../interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../data.service';
import { API } from '../../api';

@Component({
  selector: 'app-body-details',
  templateUrl: './body-details.component.html',
  styleUrls: ['./body-details.component.css']
})
export class BodyDetailsComponent implements OnInit {

  body: IBody;
  bodyId: string;

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

  /** Call the bodies API and show data */
  refresh() {
    this.dataService.FireGET(API.Body, {uuid: this.bodyId}).subscribe(result => {
      this.body = result as IBody;
    });
  }

}
