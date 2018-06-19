import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../data.service';

import OlMap from 'ol/map';
import OlXYZ from 'ol/source/xyz';
import OlLayerImage from 'ol/layer/image';
import OlLayerTile from 'ol/layer/tile';
import OlView from 'ol/view';
import OlExtent from 'ol/extent';
import OlOverlay from 'ol/overlay';
import OlLayerVector from 'ol/layer/vector';
import OlSourceImageStatic from 'ol/source/imagestatic';
import OlSourceVector from 'ol/source/vector';
import OlSourceOSM from 'ol/source/osm';
import OlSourceTileJSON from 'ol/source/tilejson';
import OlProjProjection from 'ol/proj/projection';
import OlFeature from 'ol/feature';
import OlGeomPoint from 'ol/geom/point';
import OlProj from 'ol/proj';
import OlStyleStyle from 'ol/style/style';
import OlStyleIcon from 'ol/style/icon';
import OlStyleText from 'ol/style/text';
import OlStyleStroke from 'ol/style/stroke';
import OlStyleFill from 'ol/style/fill';
import OlInteraction from 'ol/interaction';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  public locations = [];
  public map: OlMap;
  public view: OlView;
  public maploaded = false;
  public pointer = '';
  public selectedLocation;

  constructor(
    public dataService: DataService,
  ) { }

  ngAfterViewInit() {
    this.dataService.FireGET<any[]>('assets/mapdata.json').subscribe(result => {
      this.locations = result;
      this.showLoc();
    });
  }

  /** Show all locations - generate map */
  showLoc() {
    /* Make features array */
    const features = [];
    for (const loc of this.locations) {
      /* Change coordinate sysetm */
      const pos = [loc.pixel_x, 3575 - loc.pixel_y];
      /* Ignore housing, inner locations */
      if (loc.group_id !== '3' && loc.parent === '0') {

        /* Generate style */
        const iconStyle = () => {
          const zoom = this.map.getView().getZoom();

          /* Increase font size with zoom */
          const font_size = zoom * 3;

          /* Choose icon image based on group id */
          let icon_img;
          if (loc.group_id === '1' || loc.group_id === '4' || loc.group_id === '12') {
            icon_img = '/assets/circle-blue.svg';
          } else if (loc.group_id === '8') {
            icon_img = '/assets/circle-gray.svg';
          } else if (loc.group_id === '2') {
            icon_img = '/assets/circle-orange.svg';
          } else {
            icon_img = '/assets/circle-green.svg';
          }

          /* Choose short name if present */
          let loc_name = loc.name;
          if (loc.short_name !== '0') {
            loc_name = loc.short_name;
          }

          /* Make icon object */
          const icon = new OlStyleIcon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: icon_img
          }));

          /* Make text object */
          const text = new OlStyleText({
            offsetY: 20,
            padding: [20, 20, 20, 20],
            font: 'bold ' + font_size + 'px Roboto',
            text: loc_name,
            fill: new OlStyleFill({
              color: '#ffffff'
            }),
            stroke: new OlStyleStroke({
              color: '#444', width: 2
            }),
          });

          /* Generate the style */
          return new OlStyleStyle({
            image: (zoom >= 3) ? icon : null,
            text: (zoom >= 4) ? text : null,
          });
        };

        /* Make the icon */
        const iconFeature = new OlFeature({
          geometry: new OlGeomPoint(pos),
          name: loc.name,
          loc: loc
        });

        /* Push into array */
        iconFeature.setStyle(iconStyle);
        features.push(iconFeature);
      }
    }

    /* Make vector source and layer from features */
    const vectorSource = new OlSourceVector({
      features: features
    });

    const vectorLayer = new OlLayerVector({
      source: vectorSource
    });

    /* Configure map */
    const extent = [0, 0, 5430, 3575];
    const projection = new OlProjProjection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: extent
    });

    /* Make image layer */
    const imlayer = new OlLayerImage({
      source: new OlSourceImageStatic({
        attributions: 'Prof. Mandar Rane',
        url: '/assets/map.jpg',
        projection: projection,
        imageExtent: extent,
        imageLoadFunction: (image, src) => {
          /* For showing loading spinner */
          const img = image.getImage();
          img.src = src;
          img.onload = () => {
            this.maploaded = true;
          };
        }
      })
    });

    /* Disable tilting */
    const interactions = OlInteraction.defaults({altShiftDragRotate: false, pinchRotate: false});

    /* Make view */
    this.view = new OlView({
      projection: projection,
      center: OlExtent.getCenter(extent),
      zoom: 3.4,
      minZoom: 2.8,
      maxZoom: 5.5
    });

    /* Generate map */
    this.map = new OlMap({
      interactions: interactions,
      layers: [
        imlayer,
        vectorLayer
      ],
      target: 'map',
      view: this.view
    });

    /* Handle click */
    this.map.on('click', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const loc = feature.get('loc');
        const pos = [Number(loc.pixel_x), 3575 - Number(loc.pixel_y)];
        const marker = new OlOverlay({
          position: pos,
          positioning: 'center-center',
          element: document.getElementById('marker'),
          stopEvent: false
        });
        this.map.addOverlay(marker);
        this.view.animate({center: pos});
        this.view.animate({zoom: 4.5});
      }
    });

    /* Change mouse cursor on features */
    this.map.on('pointermove', (e) => {
      const pixel = this.map.getEventPixel(e.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      this.pointer = hit ? 'pointer' : '';
    });

  }

  locClick(location) {
    alert(location.name);
  }

}
