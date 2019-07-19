import { Component, OnInit } from '@angular/core';
import { IUserProfile } from '../../interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../data.service';
import { API } from '../../../api';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {
  public error: number;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const userId = params['id'];
      this.dataService.FireGET<IUserProfile>(API.User, {uuid: userId}).subscribe(() => {

      }, (e) => {
        this.error = e.status;
      });
    });
  }
}
