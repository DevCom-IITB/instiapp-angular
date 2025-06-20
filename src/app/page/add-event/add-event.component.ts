import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  IEvent,
  IBody,
  ILocation,
  IUserTagCategory,
  IUserTag,
  IOfferedAchievement,
  IInterest,
} from '../../interfaces';
import * as Fuse from 'fuse.js';
import { Helpers } from '../../helpers';
import { Observable } from 'rxjs';
import { API } from '../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

const PLACEHOLDER = 'assets/add_image_placeholder.svg';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
})
export class AddEventComponent implements OnInit {
  public venuesList: ILocation[] = [];
  public venueControls: any[] = [];
  public predefinedLocations: string[] = [
  "ACRE / Advanced Centre",
  "Aerospace Engineering",
  "AR for Research & Electronics Lab",
  "Basketball Court",
  "Central Library",
  "Central Office (Chem. Dept.)",
  "CESE / Center for Environmental Science and Engineering",
  "Chemical Department",
  "Chemistry Department",
  "Civil Engineering",
  "Computer Science & Engg.",
  "Construction Division",
  "Convocation Hall",
  "CSRE",
  "Cummins Engine Research Facility",
  "Earth Science Department",
  "Electrical Engineering",
  "Electrical Maintenance Division",
  "Elec. Maintenance Dept.",
  "Energy Systems Lab",
  "Energy Science and Engineering",
  "Environmental Science and Engineering",
  "Estate Stores / Offices",
  "Guest House",
  "Gymkhana Ground",
  "Hostel 1",
  "Hostel 10",
  "Hostel 11",
  "Hostel 12",
  "Hostel 13",
  "Hostel 14",
  "Hostel 15",
  "Hostel 16",
  "Hostel 17",
  "Hostel 18",
  "Hostel 2",
  "Hostel 3",
  "Hostel 4",
  "Hostel 5",
  "Hostel 6",
  "Hostel 7",
  "Hostel 8",
  "Hostel 9",
  "Humanities and Social Sciences (HSS)",
  "IC Engine Lab",
  "IDC",
  "Indoor Badminton Court",
  "Indoor Gymkhana Courts",
  "IRCC / Research and Consultancy",
  "Kendriya Vidyalaya (KV)",
  "KReSIT Building",
  "Lake Side",
  "Lecture Hall Complex (LHC)",
  "LTPCSA",
  "Machine Tool Lab",
  "Main Building",
  "Mathematics Department",
  "Mechanical Engineering",
  "Metallurgical Engineering and Material Science",
  "Micro Fluids Lab",
  "NanoTech & Science Research Centre (ACRE)",
  "NASAC / Nano Science & Engg. Centre",
  "NCC Office",
  "New SAC (Students Activity Centre)",
  "Old SAC (Students Activity Centre)",
  "Orthocad Lab",
  "Physics Department",
  "Rahul Bajaj Technology Innovation Centre",
  "SITC Lab",
  "SJSOM / Shailesh J. Mehta School of Management",
  "Solar Lab",
  "Sophisticated Analysis Instrument Facility (SAIF)",
  "State Bank",
  "Steam Power Lab",
  "Stores and Estate Office",
  "Swimming Pool",
  "Systems & Control Engg.",
  "Tansa House",
  "Temple (Padmavati Devi)",
  "Tennis Court",
  "Thermal Hydraulic Test Facility",
  "Tinkerers Lab (TL)",
  "UG Lab / 52 Bay",
  "Victor Menezes Convention Centre (VMCC)"
];


  public event: IEvent;

  public start_time = '00:00';
  public end_time = '00:00';

  public start_date: Date;
  public end_date: Date;

  public networkBusy = false;

  public bodies: IBody[] = [] as IBody[];
  public verification_bodies: IBody[] = [] as IBody[];
  public disabledBodies: IBody[] = [] as IBody[];

  public editing = false;
  public canDelete = false;
  public eventId: string;
  public reach: number;

  public tagCategoryList: IUserTagCategory[];

  public offeredAchievements = [] as IOfferedAchievement[];
  public fuse;

  /* Fuse config */
  public fuse_options: Fuse.FuseOptions<ILocation> = {
    shouldSort: true,
    threshold: 0.3,
    tokenize: true,
    location: 0,
    distance: 7,
    maxPatternLength: 10,
    minMatchCharLength: 1,
    keys: ['name', 'short_name'],
  };

  constructor(
    public dataService: DataService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar
  ) { }

  /** Filter venues with name */
  filterVenues(name: string): ILocation[] {
    if (!name || !this.fuse) {
      return this.venuesList;
    }
    /* Search with fuse.js*/
    return this.fuse.search(name).slice(0, 10);
  }

  get deleteInterestFunc() {
    return this.deleteInterest.bind(this);
  }

  deleteInterest(interest: IInterest) {
    this.event.event_interest = this.event.event_interest.filter(function (e) {
      return e.id !== interest.id;
    });

    this.event.interests_id = this.event.interests_id.filter(function (e) {
      return e !== interest.id;
    });
  }

  ngOnInit() {
    if (!this.dataService.isLoggedIn()) {
      alert('Please login to continue!');
      this.close(this.event);
      return;
    }

    /* Preload placeholder image */
    const img = new Image();
    img.src = PLACEHOLDER;

    /* Load locations */
    this.dataService.GetAllLocations(3).subscribe((result) => {
      /* Filter out residences */
      this.venuesList = result;
      this.fuse = new Fuse(this.venuesList, this.fuse_options);
    });

    this.bodies = this.bodies.concat(
      this.dataService.GetBodiesWithPermission('AddE')
    );
    this.sortBodies();

    this.dataService.GetVerificationBodies().subscribe(
      (bodies: IBody[]) => {
        this.verification_bodies = this.verification_bodies.concat(bodies);
      },
      (error) => {
        console.error('Error fetching verification bodies:', error);
      })

    this.sortBodies();

    this.activatedRoute.params.subscribe((params: Params) => {
      this.eventId = params['id'];
      this.refresh();
    });

    /* Load user tags */
    this.dataService
      .FireGET<IUserTagCategory[]>(API.UserTags)
      .subscribe((result) => {
        this.tagCategoryList = result;
        this.sortTags();
      });
  }

  /** Sorts all bodies by name in place */
  sortBodies() {
    this.bodies.sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Sorts all tags by name in place */
  sortTags() {
    for (const cat of this.tagCategoryList) {
      cat.tags.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );
    }
  }

  /** Loads the data */
  refresh() {
    if (this.eventId) {
      this.editing = true;
      this.dataService.GetEvent(this.eventId).subscribe(
        (result) => {
          this.dataService.setTitle(result.name);

          /* Set up filtering */
          for (const vn of result.venues) {
            const fcontrol = this.getFilterForm(vn);
            this.venueControls.push(fcontrol);
            fcontrol.form.setValue(vn.short_name);
          }
          
          /* Set data */
          this.event = result;

          /* Check if the user can edit the event */
          if (!this.dataService.CanEditEvent(this.event)) {
            alert('You do not have sufficient privileges to edit this event!');
            this.close(this.event);
          }

          /* Initialize things */
          this.initializeEvent();
          this.initializeBodiesExisting();
          this.initializeVerificationBodiesExisting();
          this.sortBodies();
          this.updateReach();

          this.offeredAchievements = this.event.offered_achievements;
          this.event.offered_achievements = null;
        },
        () => {
          alert('Event not found!');
          this.dataService.navigateBack();
        }
      );
    } else {
      this.initializeBlank();
      this.dataService.setTitle('Add Event');
    }
  }

  setInterest(click: any): void {
    const interest = {
      id: click.option.value.id,
      title: click.option.value.title,
    } as IInterest;

    if (this.event.event_interest) {
      if (
        !this.event.interests_id.find((id) => {
          return id === interest.id;
        })
      ) {
        this.event.event_interest.push(interest);
        this.event.interests_id.push(interest.id);
      }
    } else {
      this.event.event_interest = [interest];
      this.event.interests_id = [interest.id];
    }
  }

  /** Initializes constants for an existing event */
  initializeEvent() {
    /* Check if user can delete the event */
    this.canDelete = this.dataService.CanDeleteEvent(this.event);

    /* Initialize date-times */
    this.event.start_time = new Date(this.event.start_time);
    this.event.end_time = new Date(this.event.end_time);
    this.start_date = new Date(this.event.start_time);
    this.end_date = new Date(this.event.end_time);
    this.start_time = Helpers.GetTimeString(this.event.start_time);
    this.end_time = Helpers.GetTimeString(this.event.end_time);

    /* Add one venue if not present */
    if (this.event.venue_names.length === 0) {
      this.AddVenue();
    }
  }

  /** Initialize bodies for existing event after permission check */
  initializeBodiesExisting() {
    for (const body of this.event.bodies) {
      /* Remove if already present */
      const currIndex = this.bodies.map((m) => m.id).indexOf(body.id);
      if (currIndex !== -1) {
        this.bodies.splice(currIndex, 1);
      }

      /* Add according to privilege */
      if (this.dataService.HasBodyPermission(body.id, 'DelE')) {
        this.bodies.push(body);
      } else {
        this.disabledBodies.push(body);
      }
    }
  }

  initializeVerificationBodiesExisting() {
    for (const verification_body of this.event.verification_bodies) {
      /* Remove if already present */
      const currIndex = this.verification_bodies.map((m) => m.id).indexOf(verification_body.id);
      if (currIndex !== -1) {
        this.bodies.splice(currIndex, 1);
      }

      /* Add according to privilege */
      if (this.dataService.HasBodyPermission(verification_body.id, 'VerE')) {
        this.bodies.push(verification_body);
      } else {
        this.disabledBodies.push(verification_body);
      }
    }
  }


  /* Initialize a blank event */
  initializeBlank() {
    this.event = {} as IEvent;
    this.event.notify = true;
    this.event.bodies_id = [];
    this.event.interests_id = [];
    this.event.verification_bodies_id = [];
    this.event.venues = [] as ILocation[];
    this.event.user_tags = [];
    this.AddVenue();
    this.initializeQueryDefaults();
    this.updateReach();
    // After loading or initializing event
    if (!Array.isArray(this.event.verification_bodies_id)) {
      this.event.verification_bodies_id = this.event.verification_bodies_id
        ? [this.event.verification_bodies_id]
        : [];
    }
  }

  /** Initializes defaults from query parameters */
  initializeQueryDefaults() {
    const params = this.activatedRoute.snapshot.queryParams;
    console.log("hi", params.hasOwnProperty('body'))
    if (params.hasOwnProperty('body')) {
      this.event.bodies_id.push(params['body']);
    }
    if (params.hasOwnProperty('verification_bodies')) {
      this.event.verification_bodies_id = params['verification_bodies'];
    }
    if (params.hasOwnProperty('date')) {
      const date = new Date(params['date']);
      this.event.start_time = date;
      this.event.end_time = date;
      this.start_date = date;
      this.end_date = date;
    } else {
      this.event.start_time = new Date();
      this.event.end_time = new Date();
      this.start_date = new Date();
      this.end_date = new Date();
    }
  }

  /** Uses an extremely ugly hack to set time */
  timeChanged() {
    this.event.start_time = this.setTimeFrom(this.start_date, this.start_time);
    this.event.end_time = this.setTimeFrom(this.end_date, this.end_time);
  }

  /**
   * Returns a Date after setting the time from a string
   * @param date Date without proper time
   * @param time Time string HH:MM
   */
  setTimeFrom(date: Date, time: string) {
    const newDate = new Date(date);
    newDate.setHours(Number(time.substr(0, 2)), Number(time.substr(3, 2)));
    return newDate;
  }

  uploadImage(files: FileList) {
    if (!this.MarkNetworkBusy()) {
      return;
    }
    this.dataService.UploadImage(files[0]).subscribe(
      (result) => {
        this.event.image_url = result;
        this.networkBusy = false;
        this.snackBar.open('Image Uploaded', 'Dismiss', {
          duration: 2000,
        });
      },
      (error) => {
        this.networkBusy = false;
        this.snackBar.open(`Upload Failed - ${error.message}`, 'Dismiss', {
          duration: 2000,
        });
      }
    );
  }

  /** POSTs or PUTs to the server */
  go() {
    if (!this.MarkNetworkBusy()) {
      return;
    }
    this.ConstructVenuesNames();
    this.timeChanged();

    /* Validate start and end datetimes */
    if (
      this.assertValidation(
        this.event.start_time < this.event.end_time,
        'Event must end after it starts!'
      )
    ) {
      return;
    }

    // Validate building (venue)
    if (
      this.assertValidation(
        this.event.venues &&
          this.event.venues.length > 0 &&
          this.event.venues[0].short_name &&
          this.event.venues[0].short_name.trim().length > 0,
        'Venue/Building is required!'
      )
    ) {
      return;
    }

    /* Validate non zero bodies */
    if (
      this.assertValidation(
        this.event.bodies_id.length > 0,
        'No bodies selected!'
      )
    ) {
      return;
    }

    if (
      this.assertValidation(
        this.event.verification_bodies_id.length > 0,
        'No  verification bodies selected!'
      )
    ) {
      return;
    }

    /* Validate name length */
    if (
      this.assertValidation(
        this.event.name &&
        this.event.name.length > 0 &&
        this.event.name.length <= 50,
        'Event name too long/short'
      )
    ) {
      return;
    }

    // Validate subject
    if (
      this.assertValidation(
        this.event.email_subject &&
          this.event.email_subject.trim().length > 0, 
        'Email subject is required!'
      )
    ) {
      return;
    }

    // Validate description
    if (
      this.assertValidation(
        this.event.description &&
          this.event.description.trim().length > 0 , 
        'Description is required!'
      )
    ) {
      return;
    }

    /* Validate achievements */
    if (
      this.assertValidation(
        this.offeredAchievements.every((o) => this.isValidOffer(o)),
        'You have some invalid achievements!'
      )
    ) {
      return;
    }

    this.event.longdescription = this.event.description;
    /* Create observable for POST/PUT */
    let obs: Observable<IEvent>;
    if (!this.editing) {
      obs = this.dataService.PostEvent(this.event);
    } else {
      obs = this.dataService.PutEvent(this.eventId, this.event);
    }

    /* Make the request */
    obs.subscribe(
      (result) => {
        this.assertValidation(false, 'Successful!');

        /* Add one venue if not present */
        if (this.event.venue_names.length === 0) {
          this.AddVenue();
        }

        /* Update offers and quit */
        if (this.offeredAchievements.length > 0) {
          this.goOffers(result);
        } else {
          this.close(result);
        }
        /* Set editing to true */
        this.event.id = result.id;
        this.event.str_id = result.id;
        this.eventId = result.id;
        this.editing = true;
      },
      (result) => {
        /* Construct error statement */
        let string_error = '';
        for (const err of Object.keys(result.error)) {
          string_error += ' - ' + err + ': ' + result.error[err];
        }

        /* Display message */
        this.assertValidation(false, 'Error' + string_error);
      }
    );
  }

  /** Show a validation error */
  assertValidation(condition: boolean, error: string): boolean {
    if (!condition) {
      this.snackBar.open(error, 'Dismiss', {
        duration: 2000,
      });
      this.networkBusy = false;
    }
    return !condition;
  }

  /** Delete the open event */
  delete() {
    if (
      confirm(
        'Are you sure you want to delete this event? This action is irreversible!'
      )
    ) {
      this.dataService.FireDELETE(API.Event, { uuid: this.eventId }).subscribe(
        () => {
          this.snackBar.open('Event Deleted!', 'Dismiss', {
            duration: 2000,
          });
          this.router.navigate(['feed']);
        },
        (error) => {
          if (error.detail) {
            alert(error.detail);
          } else {
            alert(
              'Deleting failed. Are you sure you have the required permissions?'
            );
          }
        }
      );
    }
  }

  /** Tries to mark the network as busy */
  MarkNetworkBusy(): Boolean {
    if (this.networkBusy) {
      return false;
    }
    this.networkBusy = true;
    return true;
  }

  /** Add a new venue */
  AddVenue() {
    if (!this.event.venues) {
      this.event.venues = [] as ILocation[];
    }
    const new_loc: any = {};

    /* Set up filtering */
    const ff = this.getFilterForm(new_loc);
    this.venueControls.push(ff);

    this.event.venues.push(new_loc as ILocation);
  }

  /** Get a form for filtering */
  getFilterForm(location: ILocation) {
    const form = new FormControl();
    const filteredLocations = form.valueChanges.pipe(
      map((result) => {
        location.short_name = result;
        return this.filterVenues(result);
      })
    );
    return { form: form, filteredLocations: filteredLocations };
  }

  /** Make and remove blank venues from event.venue_names */
  ConstructVenuesNames() {
    this.event.venue_names = this.event.venues.map((v) => v.short_name);
    this.event.venue_names = this.event.venue_names.filter(
      (v) => v && v !== ''
    );
  }

  /** Removes venue at index */
  RemoveVenue(i: number) {
    this.event.venues.splice(i, 1);
    this.venueControls.splice(i, 1);
  }

  /** Open the event page */
  close(event: IEvent) {
    if (this.dataService.isSandbox) {
      window.location.href = '/event/' + event.str_id;
    } else {
      this.router.navigate(['event', event.str_id]);
    }
  }

  /**
   * Gets the image URL or placeholder
   */
  getImageUrl() {
    if (this.event && this.event.image_url && this.event.image_url !== '') {
      return this.event.image_url;
    } else {
      return PLACEHOLDER;
    }
  }

  /** Returns true if the event has this tag attached */
  hasTag(tag: IUserTag) {
    return this.event.user_tags.includes(tag.id);
  }

  /** Toggle a UserTag on the current event */
  toggleTag(tag: IUserTag) {
    if (this.hasTag(tag)) {
      const index = this.event.user_tags.indexOf(tag.id);
      this.event.user_tags.splice(index, 1);
    } else {
      this.event.user_tags.push(tag.id);
    }
    this.updateReach();
  }

  /** Update reach count */
  updateReach() {
    this.reach = null;
    this.dataService
      .FirePOST<any>(API.UserTagsReach, this.event.user_tags)
      .subscribe((result) => {
        this.reach = result.count;
      });
  }

  /** Returns true if at least one tag from category */
  isCategoryRestricted(category: IUserTagCategory): boolean {
    return category.tags.some((tag) => this.hasTag(tag));
  }

  /** Add a new offered achievement */
  addOffer(): void {
    const offer = {
      stat: 0,
      generic: 'generic',
    } as IOfferedAchievement;
    if (this.event.bodies_id.length > 0) {
      offer.body = this.event.bodies_id[0];
    }
    this.offeredAchievements.push(offer);
  }

  /** Remove an offer */
  removeOffer(offer: IOfferedAchievement): void {
    const spl = () => {
      const index = this.offeredAchievements.indexOf(offer);
      this.offeredAchievements.splice(index, 1);
    };

    /* Check if the offer actually exists */
    if (offer.id && offer.id !== '') {
      if (confirm('Remove this achievement? This is irreversible!')) {
        this.dataService
          .FireDELETE(API.AchievementOffer, { id: offer.id })
          .subscribe(
            () => {
              spl();
            },
            (error) => {
              this.snackBar.open(
                `Failed to delete achievement: ${error.message}`
              );
            }
          );
      }
    } else {
      spl();
    }
  }

  /** Create or update achievement offers and quit */
  goOffers(result: IEvent): void {
    this.event.offered_achievements = [];
    for (const offer of this.offeredAchievements) {
      /* Set ID from event */
      offer.event = result.id;
      offer.priority = this.offeredAchievements.indexOf(offer);

      /* Get the observable */
      let obs: Observable<IOfferedAchievement>;
      if (offer.id && offer.id !== '') {
        obs = this.dataService.FirePUT<IOfferedAchievement>(
          API.AchievementOffer,
          offer,
          { id: offer.id }
        );
      } else {
        obs = this.dataService.FirePOST<IOfferedAchievement>(
          API.AchievementsOffer,
          offer
        );
      }

      /* Fire the call */
      obs.subscribe(
        (res) => {
          this.pushOffer(res);
          res.stat = 1;
          this.offeredAchievements[res.priority] = res;

          if (
            this.event.offered_achievements.length ===
            this.offeredAchievements.length
          ) {
            this.close(result);
          }
        },
        () => {
          this.snackBar.open(
            `Achievement ${offer.title} failed. The event was updated.`,
            'Dismiss',
            { duration: 2000 }
          );
          offer.stat = 2;
        }
      );
    }
  }

  /** Pushes offer into the event */
  pushOffer(offer: IOfferedAchievement): void {
    /* Push or replace */
    const i = this.event.offered_achievements
      .map((o) => o.id)
      .indexOf(offer.id);
    if (i !== -1) {
      this.event.offered_achievements[i] = offer;
    } else {
      this.event.offered_achievements.push(offer);
    }
  }

  /** Validates achievement offer */
  isValidOffer(offer: IOfferedAchievement): boolean {
    if (
      !offer.title ||
      offer.title.length === 0 ||
      offer.title.length > 50 ||
      !offer.body ||
      offer.body.length === 0
    ) {
      offer.stat = 2;
      return false;
    }

    offer.stat = 0;
    return true;
  }
}
