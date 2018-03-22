import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl } from '@angular/forms';
import { IEvent, IBody, ILocation } from '../interfaces';
import { Time } from '@angular/common';
import { Helpers } from '../helpers';
import { Observable } from 'rxjs/Observable';
import { API } from '../../api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  public venuesList = [];

  public event: IEvent;

  public start_time = '00:00';
  public end_time = '00:00';

  public networkBusy = false;

  public bodies: IBody[] = [] as IBody[];
  public disabledBodies: IBody[] = [] as IBody[];

  public editing = false;
  public canDelete = false;
  public eventId: string;

  constructor(
    public dataService: DataService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
  ) {
    /* Load locations */
    dataService.GetAllLocations().subscribe(result => {
      this.venuesList = result.map(r => r.name);
    });
  }

  /** Filter venues with name */
  filterVenues(name: string): string[] {
    if (!name) { return this.venuesList; }
    return this.venuesList.filter(venue =>
      venue.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  ngOnInit() {
    if (!this.dataService.loggedIn) {
      alert('Please login to continue!');
      this.close();
      return;
    }

    this.bodies = this.bodies.concat(this.dataService.GetBodiesWithPermission('AddE'));

    this.activatedRoute.params.subscribe((params: Params) => {
      this.eventId = params['id'];
      if (this.eventId) {
        this.editing = true;
        this.dataService.GetEvent(this.eventId).subscribe(result => {
          this.event = result;

          /* Check if the user can edit the event */
          if (!this.dataService.CanEditEvent(this.event)) {
            alert('You do not have sufficient privileges to edit this event!');
            this.close();
          }

          /* Check if user can delete the event */
          this.canDelete = this.dataService.CanDeleteEvent(this.event);

          /* Initialize date-times */
          this.event.start_time = new Date(this.event.start_time);
          this.event.end_time = new Date(this.event.end_time);
          this.start_time = Helpers.GetTimeString(this.event.start_time);
          this.end_time = Helpers.GetTimeString(this.event.end_time);

          /* Add one venue if not present */
          if (this.event.venue_names.length === 0) { this.AddVenue(); }

          /* Add bodies according to permission */
          for (const body of this.event.bodies) {
            /* Remove if already present */
            const currIndex = this.bodies.map(m => m.id).indexOf(body.id);
            if (currIndex !== -1 ) {
              this.bodies.splice(currIndex, 1);
            }

            /* Add according to privilege */
            if (this.dataService.HasBodyPermission(body.id, 'DelE')) {
              this.bodies.push(body);
            } else {
              this.disabledBodies.push(body);
            }
          }

        }, (error) => {
          alert('Event not found!');
          this.close();
        });
      } else {
        /* Initialize blank */
        this.event = {} as IEvent;
        this.event.start_time = new Date();
        this.event.end_time = new Date();
        this.event.bodies_id = [];
        this.event.venues = [] as ILocation[];
        this.AddVenue();
      }
    });
  }

  /** Uses an extremely ugly hack to set time */
  timeChanged() {
    this.setTimeFrom(this.event.start_time, this.start_time);
    this.setTimeFrom(this.event.end_time, this.end_time);
  }

  /**
   * Returns a Date after setting the time from a string
   * @param date Date without proper time
   * @param time Time string HH:MM
   */
  setTimeFrom(date: Date, time: string) {
    date.setHours(
      Number(time.substr(0, 2)),
      Number(time.substr(3, 2)));
    return date;
  }

  uploadImage(files: FileList) {
    if (!this.MarkNetworkBusy()) { return; }

    this.dataService.UploadImage(files[0]).subscribe(result => {
      this.event.image_url = result.picture;
      this.networkBusy = false;
      this.snackBar.open('Image Uploaded', 'Dismiss', {
        duration: 2000,
      });
    }, () => {
      this.networkBusy = false;
      this.snackBar.open('Image Uploading Failed', 'Dismiss', {
        duration: 2000,
      });
    });
  }

  /** POSTs or PUTs to the server */
  go() {
    if (!this.MarkNetworkBusy()) { return; }
    this.ConstructVenuesNames();
    this.timeChanged();

    let obs: Observable<IEvent>;
    if (!this.editing) {
      obs = this.dataService.PostEvent(this.event);
    } else {
      obs = this.dataService.PutEvent(this.eventId, this.event);
    }

    obs.subscribe(result => {
      this.snackBar.open('Successful!', 'Dismiss', {
        duration: 2000,
      });
      this.networkBusy = false;

      /* Add one venue if not present */
      if (this.event.venue_names.length === 0) { this.AddVenue(); }

      /* Quit if not editing */
      if (!this.editing) {
        this.close();
      }
    }, () => {
      this.snackBar.open('An error occured!', 'Dismiss', {
        duration: 2000,
      });
      this.networkBusy = false;
    });
  }

  /** Delete the open event */
  delete() {
    if (confirm('Are you sure you want to delete this event? This action is irreversible!')) {
      this.dataService.FireDELETE(API.Event, {uuid: this.eventId}).subscribe(() => {
        this.snackBar.open('Event Deleted!', 'Dismiss', {
          duration: 2000,
        });
        this.close();
      }, (error) => {
        if (error.detail) {
          alert(error.detail);
        } else {
          alert('Deleting failed. Are you sure you have the required permissions?');
        }
      });
    }
  }

  /** Tries to mark the network as busy */
  MarkNetworkBusy(): Boolean {
    if (this.networkBusy) { return false; }
    this.networkBusy = true;
    return true;
  }

  /** Add a new venue */
  AddVenue() {
    if (!this.event.venues) {
      this.event.venues = [] as ILocation[];
    }
    const new_loc = {} as ILocation;
    this.event.venues.push(new_loc);
  }

  /** Make and remove blank venues from event.venue_names */
  ConstructVenuesNames() {
    this.event.venue_names = this.event.venues.map(v => v.name);
    this.event.venue_names = this.event.venue_names.filter(v => v !== '');
  }

  /** Removes venue at index */
  RemoveVenue(i: number) {
    this.event.venues.splice(i, 1);
  }

  /** Navigate back */
  close() {
    this.dataService.navigateBack();
  }

}
