import { Component, AfterViewInit } from '@angular/core';
import { DataService } from '../data.service';

import OlMap from 'ol/map';
import OlLayerImage from 'ol/layer/image';
import OlView from 'ol/view';
import OlExtent from 'ol/extent';
import OlOverlay from 'ol/overlay';
import OlLayerVector from 'ol/layer/vector';
import OlSourceImageStatic from 'ol/source/imagestatic';
import OlSourceVector from 'ol/source/vector';
import OlProjProjection from 'ol/proj/projection';
import OlFeature from 'ol/feature';
import OlGeomPoint from 'ol/geom/point';
import OlGeomPolygon from 'ol/geom/polygon';
import OlStyleStyle from 'ol/style/style';
import OlStyleCircle from 'ol/style/circle';
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

  /* Data */
  public locations = [];

  /* Map */
  public map: OlMap;
  public view: OlView;
  public vectorLayer: OlLayerVector;

  /* Helpers */
  public locations_copy = [];
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

      /* Increase font size with zoom */
      const font_size = zoom * 3;

      /* Choose short name if present */
      let loc_name = loc.name;
      if (loc.short_name !== '0') {
        loc_name = loc.short_name;
      }

      /* Choose icon color based on group id */
      let icon_color;
      if (loc.group_id === '1' || loc.group_id === '4' || loc.group_id === '12') {
        icon_color = 'blue';
      } else if (loc.group_id === '8') {
        icon_color = 'gray';
      } else if (loc.group_id === '2') {
        icon_color = 'orange';
      } else {
        icon_color = 'lightgreen';
      }

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
    const extent = [0, 0, 5430, 3575];
    const projection = new OlProjProjection({
      code: 'instiMAP',
      units: 'pixels',
      extent: extent
    });

    /* Make image layer */
    const imlayer = new OlLayerImage({
      source: new OlSourceImageStatic({
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
      maxZoom: 5.5,
      extent: [300, 300, 5000, 3000]
    });

    /* Generate map */
    this.map = new OlMap({
      interactions: interactions,
      layers: [
        imlayer,
        this.vectorLayer
      ],
      target: 'map',
      view: this.view
    });

    /* Handle click */
    this.map.on('click', (evt) => {
      /* Create extent of acceptable click */
      const pixel = evt.pixel;
      const pixelOffSet = 30;
      const pixelWithOffsetMin = [pixel[0] - pixelOffSet, pixel[1] + pixelOffSet];
      const pixelWithOffsetMax = [pixel[0] + pixelOffSet, pixel[1] - pixelOffSet];
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
      }
    });

    /* Change mouse cursor on features */
    this.map.on('pointermove', (e) => {
      const pixel = this.map.getEventPixel(e.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      this.pointer = hit ? 'pointer' : 'grab';
    });

  }

  selectLocation(loc) {
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

  /** Fire when search input has changed */
  searchChanged(e) {
    let lname;
    if ('target' in e) {
      lname = e.target.value;
      this.locations_copy = this.locations.filter(
        l => l.name.toLowerCase().includes(lname.toLowerCase()) ||
        l.short_name.toLowerCase().includes(lname.toLowerCase())
      );
    } else if ('option' in e) {
      lname = e.option.value;
    }

    const loc = this.locations.find(l => l.name === lname);
    if (loc) {
      this.selectLocation(loc);
    }
  }

}
