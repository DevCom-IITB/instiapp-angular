import { Component, OnInit } from '@angular/core';
import { IBody } from '../interfaces';
import { DataService } from '../data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { API } from '../../api';

@Component({
  selector: 'app-update-body',
  templateUrl: './update-body.component.html',
  styleUrls: ['./update-body.component.css']
})
export class UpdateBodyComponent implements OnInit {

  body: IBody;
  bodyId: string;

  constructor(
    public dataService: DataService,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (!this.dataService.loggedIn) {
      alert('Please login to continue!');
      this.dataService.navigateBack();
      return;
    }

    this.activatedRoute.params.subscribe((params: Params) => {
      this.bodyId = params['id'];
      this.refresh();
    });
  }

  /** Loads the data */
  refresh() {
    this.dataService.FireGET(API.Body, {uuid: this.bodyId}).subscribe(result => {
      this.body = result as IBody;
    });
  }

}
