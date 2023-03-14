import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import * as InstiMap from 'instimapweb';

import * as Fuse from 'fuse.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILocation } from '../../interfaces';
import { API } from '../../../api';
import { Helpers } from '../../helpers';
import { DataService } from '../../data.service';
import { EnterFade } from '../../animations';

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
  public location1: ILocation;
  vectorlayerline: any;

  /* Helpers */
  @ViewChild('searchbox', { static: true }) searchBoxEl: ElementRef;
  @ViewChild(MatAutocompleteTrigger, { static: true }) autoComplete: MatAutocompleteTrigger;

  public maploaded = false;
  public initialMarker: string = null;
  public editing = false;

  public selLocationAnim;
  public initLocBox = false;
  public showLocBox = false;
  public mobShowLocBox = false;
  public showResidences = false;
  public showingDirections: boolean = false;
  public gotDirections: boolean =false;
  public loc1Changed: boolean = false;

  searchForm: FormControl;
  searchForm2: FormControl;
  filteredOptions: Observable<any[]>;
  filteredOptions2: Observable<any[]>;

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
    this.searchForm2 = new FormControl();
    /* Check for initial marker */
    this.activatedRoute.params.subscribe((params: Params) => {
      this.initialMarker = params['name'];
    });
  }

  ngOnInit() {
    this.dataService.setTitle('InstiMap');
    this.filteredOptions = this.searchForm.valueChanges.pipe(
      map(result =>
        this.filteredLocations(result)
      )
    );
    this.filteredOptions2 = this.searchForm2.valueChanges.pipe(
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
    if (this.vectorlayerline!=loc){
      InstiMap.removeLine(this.vectorlayerline);
    }

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
  searchChanged(e, searchId:number) {
    let lname;
    if ('target' in e) {
      lname = this.filteredLocations(e.target.value)[0].name;
      this.autoComplete.closePanel();
    } else if ('option' in e) {
      lname = e.option.value;
    }

    const loc = this.locations.find(l => l.name === lname);
    if(!this.showingDirections || searchId === 2){
      if (loc && (!this.selectedLocation || this.selectedLocation.name !== loc.name)) {
        this.selectLocation(loc);
        InstiMap.moveToLocation(loc);
        this.mobileShowLoc(false);
      }
    }

    else{
      if(loc){
        this.location1 = loc;
        this.loc1Changed = true;
        InstiMap.moveMarker(loc.pixel_x, loc.pixel_y, true, 'user-marker');
        this.mobileShowLoc(false);
      }
    }
  }

  /** Toggle location showing on mobile */
  mobileShowLoc(show: boolean) {
    console.log("Entered");
    
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

  /** If has institute role to update location */
  hasUpdateRole() {
    return (!this.dataService.isMobile()) && this.dataService.HasInstitutePermission('Location');
  }

  /** PUT a location with an institute role */
  updateLocation(location: ILocation) {
    if (!this.editing) {
      this.editing = true;
      return;
    }

    /* Check for role again */
    if (!this.hasUpdateRole()) { return; }

    /* Fire the PUT request */
    this.dataService.FirePUT(API.Location, location, {id: location.id}).subscribe(() => {
      this.snackBar.open('Location Updated', 'Dismiss', { duration: 2000 });
    }, () => {
      this.snackBar.open('Updating Failed!', 'Dismiss', { duration: 2000 });
    });
  }

  setDirections(){
    let x1,y1,x2,y2;

    if(this.loc1Changed){
      x1 = this.location1.pixel_x;
      y1 = this.location1.pixel_y;
    }
    else{
      x1=this.geoLocationLast().pixel_x;  
      y1=this.geoLocationLast().pixel_y;
    }
    x2=this.selectedLocation.pixel_x;
    y2=this.selectedLocation.pixel_y;
    if (this.vectorlayerline !== undefined){
      InstiMap.removeLine(this.vectorlayerline);
    }
    this.vectorlayerline=InstiMap.makeline(x1,y1,x2,y2,"#000000", 5);
  }
  showDirections(){
    
    this.showingDirections = true;
    this.getGPS();
    this.searchForm.setValue("Your Location");
    this.searchForm2.setValue( this.selectedLocation.name);
    this.gotDirections=true;
    
  }

}
