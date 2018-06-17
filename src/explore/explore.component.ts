import { Component, OnInit } from '@angular/core';
import { DataService } from '../app/data.service';
import { IBody, IEvent, IUserProfile } from '../app/interfaces';
import { API } from '../api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  public bodies: IBody[];
  public events: IEvent[];
  public users: IUserProfile[];
  public searchQ: string;

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.dataService.FireGET<IBody[]>(API.Bodies).subscribe(result => {
      this.bodies = result;
    });
  }

  /** Fire the search API */
  search(query: string, noerror: boolean = false) {
    if (query.length < 5) {
      if (!noerror) {
        this.snackBar.open('Invalid query - At least 5 characters', 'Dismiss', {
          duration: 2000,
        });
      }
      return;
    }

    this.dataService.FireGET<any>(API.Search, {query: query}).subscribe(result => {
      this.bodies = result.bodies;
      this.events = result.events;
      this.users = result.users;
    });
  }

}
