import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../data.service';
import { IBody, IEvent, IUserProfile } from '../interfaces';
import { API } from '../../api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  public bodies: IBody[];
  public allbodies: IBody[];
  public events: IEvent[];
  public users: IUserProfile[];
  public searchQ: string;
  public error: number;
  public seltab = -1;
  public isloading = false;

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.dataService.FireGET<IBody[]>(API.Bodies).subscribe(result => {
      this.bodies = result;
      this.allbodies = result;
    }, (e) => {
      this.error = e.status;
    });
  }

  /** Fire the search API */
  search(query: string, noerror: boolean = false) {
    if (query.length === 0) {
      this.bodies = this.allbodies;
      this.users = [];
      this.events = [];
      this.seltab = -1;
      return;
    }

    if (query.length < 3) {
      if (!noerror) {
        this.snackBar.open('Invalid query - At least 3 characters', 'Dismiss', {
          duration: 2000,
        });
      }
      return;
    }

    this.isloading = true;
    this.dataService.FireGET<any>(API.Search, {query: query}).subscribe(result => {
      this.bodies = result.bodies;
      this.events = result.events;
      this.users = result.users;
      if (this.seltab === -1) { this.selectTab(0); }
      this.isloading = false;
    });
  }

  /** Select a filter tab */
  selectTab(tab: number) {
    this.seltab = tab;
    this.changeDetectorRef.detectChanges();
  }

  /** Get bodies after filter */
  getBodies() {
    if ([-1, 0, 1].includes(this.seltab)) { return this.bodies; }
    return [];
  }

  /** Get events after filter */
  getEvents() {
    if ([-1, 0, 2].includes(this.seltab)) { return this.events; }
    return [];
  }

  /** Get people after filter */
  getPeople() {
    if ([-1, 0, 3].includes(this.seltab)) { return this.users; }
    return [];
  }

}
