import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Location } from "@angular/common";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormControl } from "@angular/forms";

import * as InstiMap from "instimapline";

import * as Fuse from "fuse.js";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ILocation } from "../../interfaces";
import { API } from "../../../api";
import { Helpers } from "../../helpers";
import { DataService } from "../../data.service";
import { EnterFade } from "../../animations";
import { HttpClient } from "@angular/common/http";
import { IPath } from "../../interfaces";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
  animations: [EnterFade],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  /* Data */
  public locations: ILocation[];
  public selectedLocation: ILocation;

  /* Helpers */
  @ViewChild("searchbox", { static: true }) searchBoxEl: ElementRef;
  @ViewChild(MatAutocompleteTrigger, { static: true })
  autoComplete: MatAutocompleteTrigger;

  public maploaded = false;
  public initialMarker: string = null;
  public editing = false;

  public selLocationAnim;
  public initLocBox = false;
  public showLocBox = false;
  public mobShowLocBox = false;
  public showResidences = false;

  lastres;
  templine;

  searchandinfoboxposition = false;
  searchForm: FormControl;
  filteredOptions: Observable<any[]>;
  // location: { origin:string;destination:string }
  /* Fuse config */
  public fuse_options: Fuse.FuseOptions<ILocation> = {
    shouldSort: true,
    threshold: 0.3,
    tokenize: true,
    location: 0,
    distance: 7,
    maxPatternLength: 10,
    minMatchCharLength: 1,
    keys: ["name", "short_name"],
  };
  originAndDestinationData: IPath = {
    origin: "",
    destination: "",
  };
  public fuse;

  constructor(
    public http: HttpClient,
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public location: Location
  ) {
    this.searchForm = new FormControl();
    /* Check for initial marker */
    this.activatedRoute.params.subscribe((params: Params) => {
      this.initialMarker = params["name"];
    });
  }

  ngOnInit() {
    console.log(InstiMap.getGeolocationLast());

    this.dataService.setTitle("InstiMap");
    this.filteredOptions = this.searchForm.valueChanges.pipe(
      map((result) => this.filteredLocations(result))
    );
    document.getElementById("searchbox-origin").style.visibility = "hidden";
  }

  ngAfterViewInit() {
    this.dataService.FireGET<ILocation[]>(API.Locations).subscribe((result) => {
      this.locations = result;
      this.fuse = new Fuse(this.locations, this.fuse_options);
      this.showLoc();

      /* Show initial marker if set */
      if (this.initialMarker != null) {
        const locs = this.locations.filter(
          (l) => Helpers.getPassable(l.short_name) === this.initialMarker
        );
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
    InstiMap.getMap(
      {
        mapPath: "assets/map.jpg",
        mapMinPath: "assets/map-min.jpg",
        markersBase: "/assets/map/",
        attributions:
          '<a href="http://mrane.com/" target="_blank">Prof. Mandar Rane</a>',
        map_id: "map",
        marker_id: "marker",
        user_marker_id: "user-marker",
      },
      this.locations,
      (loc: ILocation) => {
        this.selectLocation(loc);
      },
      () => {
        this.maploaded = true;
      }
    );
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
    const urlParam =
      location != null ? `/${Helpers.getPassable(location.short_name)}` : "";
    const urlTree = this.router.createUrlTree([`/map${urlParam}`], {
      relativeTo: this.activatedRoute,
    });
    this.location.go(urlTree.toString());
  }

  /** Return fuzzy filtered locations */
  filteredLocations(name: string) {
    /* Search with fuse.js*/
    return this.fuse.search(name).slice(0, 10);
  }

  /** Toggle location showing on mobile */
  mobileShowLoc(show: boolean) {
    this.mobShowLocBox = show;
  }

  /** Show/hide residence buildings on map */
  toggleResidences() {
    this.showResidences = !this.showResidences;
    InstiMap.setResidencesVisible(this.showResidences);
    let msg = "Residences Visible";
    if (!this.showResidences) {
      msg = "Residences Hidden";
    }
    this.snackBar.open(msg, "Dismiss", {
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
    return b ? "true" : "false";
  }

  /** If has institute role to update location */
  hasUpdateRole() {
    return (
      !this.dataService.isMobile() &&
      this.dataService.HasInstitutePermission("Location")
    );
  }

  /** PUT a location with an institute role */
  updateLocation(location: ILocation) {
    if (!this.editing) {
      this.editing = true;
      return;
    }

    /* Check for role again */
    if (!this.hasUpdateRole()) {
      return;
    }

    /* Fire the PUT request */
    this.dataService
      .FirePUT(API.Location, location, { id: location.id })
      .subscribe(
        () => {
          this.snackBar.open("Location Updated", "Dismiss", { duration: 2000 });
        },
        () => {
          this.snackBar.open("Updating Failed!", "Dismiss", { duration: 2000 });
        }
      );
  }
  searchChangedDestination(e) {
    let lname;
    if ("target" in e) {
      this.autoComplete.closePanel();
      this.initLocBox = false;
    } else if ("option" in e) {
      lname = e.option.value;
    }

    const loc = this.locations.find((l) => l.name === lname);
    if (
      loc &&
      (!this.selectedLocation || this.selectedLocation.name !== loc.name)
    ) {
      this.selectLocation(loc);
      InstiMap.moveToLocation(loc);
      this.mobileShowLoc(false);
    }
    this.originAndDestination();
  }
  searchChangedOrigin(e) {
    let lname;
    if ("target" in e) {
      this.autoComplete.closePanel();
      this.initLocBox = false;
    } else if ("option" in e) {
      lname = e.option.value;
    }

    const locorg = this.locations.find((l) => l.name === lname);
    if (
      locorg &&
      (!this.selectedLocation || this.selectedLocation.name !== locorg.name)
    ) {
      InstiMap.moveToLocation(locorg);
      this.mobileShowLoc(false);
    }
    this.originAndDestination();
  }

  originAndDestination() {
    this.dataService
      .FirePOST<IPath>(API.ShortestPath, this.originAndDestinationData)
      .subscribe((res) => {
        this.makelineonmap(res);
      });
  }
  markDestination() {
    this.initLocBox = false;
    this.searchandinfoboxposition = true;
    this.searchAndInfoBoxPosition();
  }

  buttonVisiblity() {}
  searchAndInfoBoxPosition() {
    if (this.searchandinfoboxposition) {
      document.getElementById("searchbox-origin").style.visibility = "visible";
      if (window.innerWidth < 768) {
        document.getElementById("searchbox-destination").style.top = "110px";
      } else {
        document.getElementById("searchbox-destination").style.top = "170px";
      }
    } else {
      document.getElementById("searchbox-origin").style.visibility = "hidden";
      document.getElementById("searchbox-destination").style.top =
        "calc(100px)";
    }
  }

  makelineonmap(response) {
    this.removelines();
    this.lastres = response;
    const len = response.length;
    for (let i = 0; i < len; i++) {
      this.templine = InstiMap.makeline(
        response[i][0],
        response[i][1],
        response[i + 1][0],
        response[i + 1][1],
        "red",
        5
      );
      this.lastres[i] = this.templine;
    }
  }

  removelines() {
    if (this.lastres != null || undefined) {
      for (let i = 0; i < this.lastres.length; i++) {
        InstiMap.removeLine(this.lastres[i]);
      }
    }
  }

  getCurrentLocation() {
    console.log(InstiMap.getGeolocationLast());
    this.originAndDestinationData.origin = InstiMap.getGeolocationLast();
    this.dataService
      .FirePOST<IPath>(API.ShortestPath, this.originAndDestinationData)
      .subscribe((res) => {
        this.makelineonmap(res);
      });
  }
}
