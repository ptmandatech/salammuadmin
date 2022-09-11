import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Quill from 'quill';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

//map
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {useGeographic} from 'ol/proj';
import Layer from 'ol/layer/Layer';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import PluggableMap from 'ol/PluggableMap';
import TileWMS from 'ol/source/TileWMS';
const Geocoder = require('ol-geocoder');
import { HttpClient, HttpHeaders } from '@angular/common/http';

useGeographic();

@Component({
  selector: 'app-dialog-ranting',
  templateUrl: './dialog-ranting.component.html',
  styleUrls: ['./dialog-ranting.component.scss']
})
export class DialogRantingComponent implements OnInit {

  
  dataRanting: any = {};
  isCreated:boolean;
  serverImg:any;
  @ViewChild('mapElementRef', { static: true }) mapElementRef: ElementRef | undefined;
  map!: Map;
  constructor(
    public http:HttpClient,
    public common: CommonService,
    public dialogRef: MatDialogRef<DialogRantingComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) { 
    Loading.pulse();
    this.serverImg = this.common.photoBaseUrl+'cr/';
    this.dataRanting = sourceData.data;
    if(this.dataRanting == null) {
      this.dataRanting = {};
      this.isCreated = true;
      this.dataRanting.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
    } else {
      this.isCreated = false;
    }
    this.generateMap(undefined);
    Loading.remove();
  }

  longitude:any;
  latitude:any;
  marker!: Feature;
  vectorSource!: VectorSource;
  vectorLayer!: VectorLayer;
  height:any='300px';
  showToolbar:boolean=false;
  title:any = 'SalamMU';
  center:any=[110.3647,-7.8014];
  locationNow:any;
  generateMap(data:any)
  {
    if(this.dataRanting.pin != null) {
      data = JSON.parse(this.dataRanting.pin);
    }
    var features = [];
    if(data == undefined) {
      this.longitude = 110.3647;
      this.latitude = -7.8014;
      this.locationNow = {};
      this.locationNow.lat = this.latitude;
      this.locationNow.long = this.longitude;
      features.push(coloredSvgMarker([0,0], "SalamMU", "red"));
    } else {
      this.latitude = data.lat;
      this.longitude = data.long;
      features.push(coloredSvgMarker([this.longitude,this.latitude], "SalamMU", "red"));
      this.getDetailLocation(data);
    }

    this.vectorSource = new VectorSource({
      features: features
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    //get element ud
    var mapContainer = document.getElementsByClassName('ol-viewport');
    if(mapContainer != undefined && mapContainer[0] != undefined) mapContainer[0].remove();

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.vectorLayer
      ],
      view: new View({
        center: [this.longitude, this.latitude],
        zoom: 14
      }),
      // style: new Style({
      //   image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
      //     anchor: [0.5, 46],
      //     anchorXUnits: 'fraction',
      //     anchorYUnits: 'pixels',
      //     src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png',
      //     scale: 0.5
      //   }))
      // })
    });
    this.map.on('moveend',()=>{
      var center=(this.map.getView().getCenter());
      this.longitude=center[0];
      this.latitude=center[1];
    });

    var view = new View({
      center: [0, 0],
      zoom: 1,
    });

    var wmsSource = new TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      params: {'LAYERS': 'ne:ne', 'TILED': true},
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
    });

    this.map.on('singleclick', (evt) => {
      this.longitude = evt.coordinate[0];
      this.latitude = evt.coordinate[1];
      if(this.locationNow == undefined) {
        this.locationNow = {};
      }
      this.locationNow.lat = this.latitude;
      this.locationNow.long = this.longitude;
      var dt = {
        lat: this.locationNow.lat,
        long: this.locationNow.long
      }
      this.getDetailLocation(dt);
      this.dataRanting.pin = JSON.stringify(dt);
      this.map.removeLayer(this.vectorLayer);
      document.getElementById('info').innerHTML = '';
      var viewResolution = /** @type {number} */ (view.getResolution());
      var url = wmsSource.getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        'EPSG:3857',
        {'INFO_FORMAT': 'text/html'}
      );
      if (url) {
        fetch(url)
          .then(function (response) {
            return response.text();
          })
          .then(function (html) {
            document.getElementById('info').innerHTML = html;
          });
      }

      features = [];
      features.push(coloredSvgMarker([this.locationNow.long,this.locationNow.lat], "Lokasi Anda", "red"));

      this.vectorSource = new VectorSource({
        features: features
      });

      this.vectorLayer = new VectorLayer({
        source: this.vectorSource
      });

      this.map.addLayer(this.vectorLayer);
    });

    var that = this;
    //Instantiate with some options and add the Control
    var geocoder = new Geocoder('nominatim', {
      provider: 'osm',
      lang: 'id',
      placeholder: 'Cari Lokasi ...',
      limit: 5,
      debug: false,
      autoComplete: true,
      keepOpen: true
    });
    this.map.addControl(geocoder);

    //Listen when an address is chosen
    geocoder.on('addresschosen', function (evt:any) {
      that.map.getView().setCenter([evt.place.lon, evt.place.lat]);
      that.map.getView().setZoom(11);
    });

    function coloredSvgMarker(lonLat:any,name:any, color:any) {
      if (!color) color = 'red';
      var feature = new Feature({
        geometry: new Point(lonLat),
        name: name
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1.0],
            // anchorXUnits: 'fraction',
            // anchorYUnits: 'fraction',
            src: './assets/icon/marker.svg',
            scale: 2,
            imgSize: [30, 30],
          })
        })
      );
      return feature;
    }

    setTimeout(() => {
      this.map.setTarget(document.getElementById('map'));
    }, 1000);
  }

  httpOption:any;
  detailLocSelected:any;
  city:any;
  async getDetailLocation(dt:any) {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat +'&lon=' + dt.long, this.httpOption).subscribe(async res => {
      this.detailLocSelected = res;
      if(this.detailLocSelected == undefined || this.detailLocSelected.address.state_district == undefined) {
        await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
          this.detailLocSelected = res;
          this.city = this.detailLocSelected.features[0].properties.address.state;
        })
      } else {
        this.city = this.detailLocSelected.address.state_district.replace('Kota ', '');
      }
    }, async error => {
      await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
        this.detailLocSelected = res;
        this.city = this.detailLocSelected.city.replace('Kota ', '');
      })
    });
  }

  ngOnInit(): void {
    this.cekLogin();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    });
  }

  byPassedHTMLString:any;
  modules = {
    toolbar: [
      ['image', 'video']
    ],
    imageHandler: {
      upload: (file) => {
        return new Promise(async (resolve, reject) => {
          if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') { // File types supported for image
            if (file.size < 1000000) { // Customize file size as per requirement
            
            // Sample API Call
              let input = new FormData();
              input.append('file', file);
              // let image;
              // this.base64.encodeFile(file)
              //         .then((base64File: string) => {
              //   image = base64File;
              //   console.log(image)
              // }, (err) => {
              //   alert('err '+ err);
              // });
              return this.api.postCrImg('sicara/quilluploadfoto/'+this.dataRanting.id, input)
                .then(result => {
                  resolve(this.common.serverImgPath+result); // RETURN IMAGE URL from response
                })
                .catch(error => {
                  reject('Upload failed'); 
                  // Handle error control
                  console.error('Error:', error);
                });
            } else {
              reject('Size too large');
            // Handle Image size large logic 
            }
          } else {
            reject('Unsupported type');
          // Handle Unsupported type logic
          }
        });
      },
      accepts: ['png', 'jpg', 'jpeg', 'jfif'] // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
    } as Options
  }

  save() {
    this.api.put('sicara/sicara_prm/'+this.dataRanting.id, this.dataRanting).then(res => {
      if(res) {
        Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
        this.dialogRef.close();
      }
    })
  }

}
