import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar, MatAutocompleteTrigger } from '@angular/material';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import * as InstiMap from 'instimapweb';

import * as Fuse from 'fuse.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILocation } from '../interfaces';
import { API } from '../../api';
import { Helpers } from '../helpers';
import { DataService } from '../data.service';
import { EnterFade } from '../animations';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  animations: [EnterFade]
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  /* Data */
  public locations: ILocation[];
  public selectedLocation: ILocation;

  /* Helpers */
  @ViewChild('searchbox') searchBoxEl: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autoComplete: MatAutocompleteTrigger;

  public maploaded = false;
  public initialMarker: string = null;

  public selLocationAnim;
  public initLocBox = false;
  public showLocBox = false;
  public mobShowLocBox = false;
  public showResidences = false;

  searchForm: FormControl;
  filteredOptions: Observable<any[]>;

  /* Fuse config */
  public fuse_options: Fuse.FuseOptions<ILocation> = {
    shouldSort: true,
    threshold: 0.3,
    tokenize: true,
    location: 0,
    distance: 7,
    maxPatternLength: 10,
    minMatchCharLength: 1,
    keys: [
      'name',
      'short_name'
    ]
  };

  public fuse;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public location: Location,
  ) {
    this.searchForm = new FormControl();
    /* Check for initial marker */
    this.activatedRoute.params.subscribe((params: Params) => {
      this.initialMarker = params['name'];
    });
  }

  ngOnInit() {
    this.dataService.setTitle('Map');
    this.filteredOptions = this.searchForm.valueChanges.pipe(
      map(result =>
        this.filteredLocations(result)
      )
    );

  }

  ngAfterViewInit() {
    this.dataService.FireGET<ILocation[]>(API.Locations).subscribe(result => {
      this.locations = result;
      this.fuse = new Fuse(this.locations, this.fuse_options);
      this.showLoc();

      /* Show initial marker if set */
      if (this.initialMarker != null) {
        const locs = this.locations.filter(l => Helpers.getPassable(l.short_name) === this.initialMarker);
        if (locs.length > 0) {
          this.selectLocation(locs[0]);
          InstiMap.moveToLocation(locs[0]);
        }
      }
    });
  }

  ngOnDestroy() {
    InstiMap.cleanup();
  }

  /** Show all locations - generate map */
  showLoc() {
    InstiMap.getMap({
      mapPath: 'assets/map.jpg',
      mapMinPath: 'assets/map-min.jpg',
      markersBase: '/assets/map/',
      attributions: '<a href="http://mrane.com/" target="_blank">Prof. Mandar Rane</a>',
      map_id: 'map',
      marker_id: 'marker',
      user_marker_id: 'user-marker',
    }, this.locations, (loc: ILocation) => {
      this.selectLocation(loc);
    }, () => {
      this.maploaded = true;
    });
  }

  selectLocation(loc?: ILocation) {
    /* Un-selection */
    if (loc === undefined) {
      this.showLocBox = false;
      setTimeout(() => {
        this.initLocBox = false;
      }, 230);
      this.setURL(null);
      return;
    }

    /* Set selected location */
    this.selectedLocation = loc;

    /* No delay on first click */
    if (!this.initLocBox) {
      this.initLocBox = true;
    }

    /* Show location box */
    this.selLocationAnim = loc;
    this.showLocBox = true;

    /* Set focus */
    this.searchBoxEl.nativeElement.blur();

    /* Set URL */
    this.setURL(this.selectedLocation);
  }

  /**
   * Set URL to selected location's passable name
   * @param location Location to set URL to (null for empty)
   */
  setURL(location: ILocation) {
    const urlParam = location != null ? `/${Helpers.getPassable(location.short_name)}` : '';
    const urlTree = this.router.createUrlTree(
      [`/map${urlParam}`],
      {relativeTo: this.activatedRoute});
    this.location.go(urlTree.toString());
  }

  /** Return fuzzy filtered locations */
  filteredLocations(name: string) {
    /* Search with fuse.js*/
    return this.fuse.search(name).slice(0, 10);
  }

  /** Fire when search input has changed */
  searchChanged(e) {
    let lname;
    if ('target' in e) {
      lname = this.filteredLocations(e.target.value)[0].name;
      this.autoComplete.closePanel();
    } else if ('option' in e) {
      lname = e.option.value;
    }

    const loc = this.locations.find(l => l.name === lname);
    if (loc && (!this.selectedLocation || this.selectedLocation.name !== loc.name)) {
      this.selectLocation(loc);
      InstiMap.moveToLocation(loc);
    }
  }

  /** Toggle location showing on mobile */
  mobileShowLoc(show: boolean) {
    this.mobShowLocBox = show;
  }

  /** Show/hide residence buildings on map */
  toggleResidences() {
    this.showResidences = !this.showResidences;
    InstiMap.setResidencesVisible(this.showResidences);
    let msg = 'Residences Visible';
    if (!this.showResidences) {
      msg = 'Residences Hidden';
    }
    this.snackBar.open(msg, 'Dismiss', {
      duration: 2000,
    });
  }

  /** Is the GPS being followed */
  isFollowingUser(): boolean {
    return InstiMap.isFollowingUser();
  }

  /** Last known location */
  geoLocationLast(): any {
    return InstiMap.getGeolocationLast();
  }

  /** Start GPS */
  getGPS() {
    InstiMap.getGPS();
  }

  hasGeolocation(): boolean {
    return InstiMap.hasGeolocation();
  }

  /** boolean to boolean string */
  bstr(b: boolean) {
    return b ? 'true' : 'false';
  }

}
