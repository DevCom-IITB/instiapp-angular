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
  public maploaded = false;

  constructor(
    public dataService: DataService,
  ) { }

  ngAfterViewInit() {
    this.dataService.FireGET<any[]>('assets/mapdata.json').subscribe(result => {
      this.locations = result;
      this.showLoc();
    });
  }

  showLoc() {

    const features = [];
    for (const loc of this.locations) {
      const pos = [loc.pixel_x, 3575 - loc.pixel_y];
      if (loc.group_id !== '3' && loc.parent === '0') {

        const iconStyle = () => {
          const zoom = this.map.getView().getZoom();

          let font_size = 0;
          if (zoom > 4) {
            font_size = zoom * 3;
          }

          return new OlStyleStyle({
          image: new OlStyleIcon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: '/assets/circle-green.svg'
          })),
          text: new OlStyleText({
            offsetY: 20,
            padding: [20, 20, 20, 20],
            font: 'bold ' + font_size + 'px Roboto',
            text: loc.name,
            fill: new OlStyleFill({
              color: '#ffffff'
            }),
            stroke: new OlStyleStroke({
              color: '#444', width: 2
            }),
          })
        });
      };

        const iconFeature = new OlFeature({
          geometry: new OlGeomPoint(pos),
          name: loc.name
        });
        iconFeature.setStyle(iconStyle);
        features.push(iconFeature);
      }
    }

    const vectorSource = new OlSourceVector({
      features: features
    });

    const vectorLayer = new OlLayerVector({
      source: vectorSource
    });

    const extent = [0, 0, 5430, 3575];
    const projection = new OlProjProjection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: extent
    });

    const imlayer = new OlLayerImage({
      source: new OlSourceImageStatic({
        attributions: 'Prof. Mandar Rane',
        url: '/assets/map.jpg',
        projection: projection,
        imageExtent: extent,
        imageLoadFunction: (image, src) => {
          const img = image.getImage();
          img.src = src;
          img.onload = () => {
            this.maploaded = true;
          };
        }
      })
    });

    const interactions = OlInteraction.defaults({altShiftDragRotate: false, pinchRotate: false});
    this.map = new OlMap({
      interactions: interactions,
      layers: [
        imlayer,
        vectorLayer
      ],
      target: 'map',
      view: new OlView({
        projection: projection,
        center: OlExtent.getCenter(extent),
        zoom: 3,
        minZoom: 3,
        maxZoom: 5.5
      })
    });

  }

  locClick(location) {
    alert(location.name);
  }

}
