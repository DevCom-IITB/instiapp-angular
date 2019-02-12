import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar, MatAutocompleteTrigger } from '@angular/material';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import * as Fuse from 'fuse.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import OlMap from 'ol/Map';
import OlLayerImage from 'ol/layer/Image';
import OlView from 'ol/View';
import { getCenter as OlExtentGetCenter } from 'ol/extent';
import OlOverlay from 'ol/Overlay';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceImageStatic from 'ol/source/ImageStatic';
import OlSourceVector from 'ol/source/Vector';
import OlProjProjection from 'ol/proj/Projection';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';
import OlGeomPolygon from 'ol/geom/Polygon';
import OlStyleStyle from 'ol/style/Style';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleText from 'ol/style/Text';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';
import { defaults as OlInteractionDefaults } from 'ol/interaction';
import OlControlFullscreen from 'ol/control/FullScreen';

import { ILocation } from '../interfaces';
import { API } from '../../api';
import { Helpers } from '../helpers';
import { DataService } from '../data.service';
import { EnterRight } from '../animations';
import { keyframes } from '@angular/animations';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  animations: [EnterRight]
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  /* Data */
  public locations: ILocation[];
  public selectedLocation: ILocation;

  /* Map */
  private map: OlMap;
  private view: OlView;
  private vectorLayer: OlLayerVector;
  private imlayer: OlLayerImage;
  private imExtent: any;
  private imProjection: OlProjProjection;
  private attributions = '<a href="http://mrane.com/" target="_blank">Prof. Mandar Rane</a>';

  /* Helpers */
  @ViewChild('searchbox') searchBoxEl: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autoComplete: MatAutocompleteTrigger;

  public maploaded = false;
  public initialMarker: string = null;
  public pointer = '';

  public selLocationAnim;
  public initLocBox = false;
  public showLocBox = false;
  public mobShowLocBox = false;
  public showSearch = false;
  public showResidences = false;

  public geoLocationId: number = null;
  public geoLocationLast: { pixel_x: number, pixel_y: number} = null;
  public followingUser = false;

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
    if (!this.dataService.isMobile(560)) {
      this.showSearch = true;
    }

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
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.geoLocationId != null) {
      navigator.geolocation.clearWatch(this.geoLocationId);
    }
  }

  /** Show all locations - generate map */
  showLoc() {
    /* Make features array */
    const features = [];
    for (const loc of this.locations) {
      /* Change coordinate sysetm */
      const pos: [number, number] = [loc.pixel_x, 3575 - loc.pixel_y];

      /* Ignore inner locations */
      if (loc.parent === null) {
        /* Make the Feature */
        const iconFeature = new OlFeature({
          geometry: new OlGeomPoint(pos),
          loc: loc
        });

        /* Push into array */
        features.push(iconFeature);
      }
    }

    /* Make vector source and layer from features */
    const vectorSource = new OlSourceVector({
      features: features
    });

    /* Style the vector layer */
    const vectorLayerStyle = (feature) => {
      const zoom = this.map.getView().getZoom();
      const loc = feature.get('loc');

      /* Hide residences */
      if (loc.group_id === 3 && !this.showResidences) {
        return;
      }

      /* Increase font size with zoom */
      const font_size = zoom * 3;

      /* Choose short name if present */
      let loc_name = loc.name;
      if (loc.short_name !== '0') {
        loc_name = loc.short_name;
      }

      /* Choose icon color based on group id */
      let icon_color;
      if (loc.group_id === 1 || loc.group_id === 4 || loc.group_id === 12) {
        icon_color = 'blue';
      } else if (loc.group_id === 3) {
        icon_color = 'lightgreen';
      } else if (loc.group_id === 2) {
        icon_color = 'orange';
      } else {
        icon_color = 'gray';
      }

      /* Make text object */
      const text = new OlStyleText({
        offsetY: 20,
        padding: [20, 20, 20, 20],
        font: `${font_size}px Roboto`,
        text: loc_name,
        fill: new OlStyleFill({
          color: '#ffffff'
        }),
        stroke: new OlStyleStroke({
          color: '#444', width: 3
        })
      });

      /* Icon image*/
      const icon = new OlStyleCircle({
        radius: 5,
        stroke: new OlStyleStroke({
          color: 'white',
          width: 2
        }),
        fill: new OlStyleFill({
          color: icon_color
        })
      });

      /* Make style */
      const style = new OlStyleStyle({
        image: (zoom >= 3) ? icon : null,
        text: (zoom >= 4) ? text : null,
      });
      return [style];
    };

    this.vectorLayer = new OlLayerVector({
      source: vectorSource,
      style: vectorLayerStyle
    });

    /* Configure map */
    this.imExtent = [0, 0, 5430, 3575];
    this.imProjection = new OlProjProjection({
      code: 'instiMAP',
      units: 'pixels',
      extent: this.imExtent
    });

    const staticSource = new OlSourceImageStatic({
      url: '/assets/map-min.jpg',
      attributions: this.attributions,
      projection: this.imProjection,
      imageExtent: this.imExtent,
      imageLoadFunction: (image, src) => {
        /* For showing loading spinner */
        const img: any = image.getImage();
        img.src = src;
        img.onload = () => {
          this.maploaded = true;
          this.loadHighRes();
        };
      }
    });

    /* Make image layer */
    this.imlayer = new OlLayerImage({
      source: staticSource
    });

    /* Disable tilting */
    const interactions = OlInteractionDefaults({altShiftDragRotate: false, pinchRotate: false});

    /* Make view */
    this.view = new OlView({
      projection: this.imProjection,
      center: OlExtentGetCenter(this.imExtent),
      zoom: 3.4,
      minZoom: 2,
      maxZoom: 5.5,
      extent: [300, 300, 5000, 3000]
    });

    /* Generate map */
    this.map = new OlMap({
      interactions: interactions,
      layers: [
        this.imlayer,
        this.vectorLayer
      ],
      target: 'map',
      view: this.view
    });

    /* Add controls */
    const fullscreen = new OlControlFullscreen();
    this.map.addControl(fullscreen);

    /* Handle click */
    this.map.on('click', (evt: any) => {
      /* Create extent of acceptable click */
      const pixel = evt.pixel;
      const pixelOffSet = 30;
      const pixelWithOffsetMin: [number, number] = [pixel[0] - pixelOffSet, pixel[1] + pixelOffSet];
      const pixelWithOffsetMax: [number, number] = [pixel[0] + pixelOffSet, pixel[1] - pixelOffSet];
      const XYMin = this.map.getCoordinateFromPixel(pixelWithOffsetMin);
      const XYMax = this.map.getCoordinateFromPixel(pixelWithOffsetMax);
      const ext = XYMax.concat(XYMin);
      const extentFeat = new OlFeature(new OlGeomPolygon([[
        [ext[0], ext[1]],
        [ext[0], ext[3]],
        [ext[2], ext[3]],
        [ext[2], ext[1]],
        [ext[0], ext[1]]
      ]]));

      /* Get first nearby feature */
      const feature = this.vectorLayer.getSource().forEachFeatureIntersectingExtent(
        extentFeat.getGeometry().getExtent(), (f) => f
      );

      /* Zoom in */
      if (feature) {
        const loc = feature.get('loc');
        this.selectLocation(loc);
      } else {
        /* Unselect if nothing here */
        this.showLocBox = false;
        setTimeout(() => {
          this.initLocBox = false;
        }, 250);
        this.moveMarker(-50, -50, false);
        this.setURL(null);
      }
    });

    /* Change mouse cursor on features */
    this.map.on('pointermove', (e: any) => {
      const pixel = this.map.getEventPixel(e.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      this.pointer = hit ? 'pointer' : 'move';
    });

    /* Stop following the user on drag */
    this.map.on('pointerdrag', () => {
      this.followingUser = false;
    });
  }

  selectLocation(loc: ILocation) {
    /* Set selected location */
    this.selectedLocation = loc;

    /* No delay on first click */
    let time = 250;
    if (!this.initLocBox) {
      this.initLocBox = true;
      time = 0;
    }

    /* Show location box */
    this.showLocBox = false;
    setTimeout(() => {
      this.selLocationAnim = loc;
      this.showLocBox = true;
    }, time);

    /* Move marker */
    this.moveMarker(loc.pixel_x, loc.pixel_y, true);

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

  /** Move the marker to location */
  moveMarker(x: number, y: number, center = true, markerid = 'marker') {
    const pos: [number, number] = [Number(x), 3575 - Number(y)];
    const marker = new OlOverlay({
      position: pos,
      positioning: 'center-center',
      element: document.getElementById(markerid),
      stopEvent: false
    });
    this.map.addOverlay(marker);

    /* Animate */
    if (center) {
      this.view.animate({center: pos});
      this.view.animate({zoom: 4.5});
    }
  }

  /** Return fuzzy filtered locations */
  filteredLocations(name: string) {
    /* Search with fuse.js*/
    return this.fuse.search(name).slice(0, 10);
  }

  /** Load the high resolution map */
  loadHighRes() {
    /* High res source */
    const highResSource = new OlSourceImageStatic({
      url: '/assets/map.jpg',
      attributions: this.attributions,
      projection: this.imProjection,
      imageExtent: this.imExtent,
    });

    /* Load high resolution image */
    const highRes = new Image();
    highRes.src = '/assets/map.jpg';
    highRes.onload = () => {
      this.imlayer.setSource(highResSource);
    };
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
    }
  }

  /** Toggle location showing on mobile */
  mobileShowLoc(show: boolean) {
    this.mobShowLocBox = show;
  }

  /** Top of location box for mobile */
  locBoxTop() {
    if (!this.dataService.isMobile(560)) {
      return '180px';
    }
    return this.mobShowLocBox ? '80px' : '78vh';
  }

  /** Show/hide residence buildings on map */
  toggleResidences() {
    this.showResidences = !this.showResidences;
    this.vectorLayer.getSource().changed();
    let msg = 'Residences Visible';
    if (!this.showResidences) {
      msg = 'Residences Hidden';
    }
    this.snackBar.open(msg, 'Dismiss', {
      duration: 2000,
    });
  }

  /** Determine if we support geolocation */
  hasGeolocation(): boolean {
    return navigator.geolocation ? true : false;
  }

  /** Setup a location watch */
  getGPS(): void {
    if (this.hasGeolocation()) {
      /* Start following the user */
      this.followingUser = true;

      /* If we already have permission */
      if (this.geoLocationId != null) {
        this.moveGPS(true);
        return;
      }

      /* Get permission and setup a watch */
      this.geoLocationId = navigator.geolocation.watchPosition((position: Position) => {
        this.updateGPS(position, this);
      });
    } else {
      /* This should ideally never be called */
      this.snackBar.open('Geolocation is not supported by this browser', 'Dismiss', {
        duration: 2000,
      });
    }
  }

  /** Show GPS marker on map */
  updateGPS(position: Position, self: MapComponent): void {
    const follow = self.followingUser || self.geoLocationLast == null;
    self.geoLocationLast = Helpers.getMapXY(position);
    console.log(self.geoLocationLast);
    self.moveGPS(follow);
  }

  /** Center the user marker to last known location */
  moveGPS(center: boolean) {
    if (this.geoLocationLast == null) { return; }
    this.moveMarker(
      this.geoLocationLast.pixel_x,
      this.geoLocationLast.pixel_y,
      center,
      'user-marker'
    );
  }

  /** boolean to boolean string */
  bstr(b: boolean) {
    return b ? 'true' : 'false';
  }

}
