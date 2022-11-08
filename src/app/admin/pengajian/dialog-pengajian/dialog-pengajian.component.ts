import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';

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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

useGeographic();

@Component({
  selector: 'app-dialog-pengajian',
  templateUrl: './dialog-pengajian.component.html',
  styleUrls: ['./dialog-pengajian.component.scss']
})
export class DialogPengajianComponent implements OnInit {

  penyelenggara =[
    'Cabang',
    'Ranting',
    'Lainnya'
  ]

  pengajianData: any = {};
  isCreated:boolean;
  dateValue:any;
  timeValue:any;
  today:any;
  @ViewChild('mapElementRef', { static: true }) mapElementRef: ElementRef | undefined;
  map!: Map;
  form!: FormGroup;
  get f() { return this.form.controls; }
  minDate = new Date();
  constructor(
    public http:HttpClient,
    public common: CommonService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogPengajianComponent>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    this.getAllCr();
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      speaker: [null, [Validators.required]],
      descriptions: [null, [Validators.required]],
      organizer: [null, [Validators.required]],
      branch: [null],
      twig: [null],
      organizer_name: [null],
      url_livestream: [null],
      location: [null, [Validators.required]],
      verified: [null],
      created_by: [null],
    });
    this.pengajianData = sourceData.data;
    if(this.pengajianData == null) {
      this.pengajianData = {};
      this.isCreated = true;
      this.generateMap(undefined);
    } else {
      this.isCreated = false;
      if(this.pengajianData.datetime != '0000-00-00 00:00:00.000000') {
        this.dateValue = this.datePipe.transform(new Date(this.pengajianData.datetime), 'MM/dd/yyyy');
        this.dateValue = new Date(this.dateValue);
        this.timeValue = new Date(this.pengajianData.datetime);
      }
      this.generateMap(undefined);
      if(this.pengajianData != null) {
        this.form.patchValue({
          id: this.pengajianData.id,
          name: this.pengajianData.name,
          speaker: this.pengajianData.speaker,
          descriptions: this.pengajianData.descriptions,
          organizer: this.pengajianData.organizer,
          branch: this.pengajianData.branch,
          twig: this.pengajianData.twig,
          organizer_name: this.pengajianData.organizer_name,
          url_livestream: this.pengajianData.url_livestream,
          location: this.pengajianData.location,
          verified: this.pengajianData.verified,
          created_by: this.pengajianData.created_by,
        });
      }
    }
    Loading.remove();
  }

  ngOnInit(): void {
    this.today = new Date();
    this.cekLogin();
  }

  userData:any;
  cekLogin()
  {    
    this.api.me().then(res=>{
      this.userData = res;
    });
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
    if(this.pengajianData.pin != null) {
      data = JSON.parse(this.pengajianData.pin);
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
      this.pengajianData.pin = JSON.stringify(dt);
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

    await this.http.get('https://nominatim.openstreetmap.org/reverse?format=geojson&lat=' + dt.lat +'&lon=' + dt.long, this.httpOption).subscribe(async res => {
      this.checkCity(res);
    }, async error => {
      await this.http.get('http://open.mapquestapi.com/nominatim/v1/reverse.php?key=10o857kA0hJBvz8kNChk495IHwfEwg1G&format=json&lat=' + dt.lat + '&lon=' + dt.long, this.httpOption).subscribe(res => {
        this.detailLocSelected = res;
        this.city = this.detailLocSelected.city.replace('Kota ', '');
      })
    });
  }

  async checkCity(res:any) {
    this.detailLocSelected = res.features[0].properties;
    this.city = res.features[0].properties.address.city == null ? res.features[0].properties.address.town:res.features[0].properties.address.city;
  }

  listCabang:any = [];
  listRanting:any = [];
  async getAllCr() {
    // this.api.get('cr').then(res => {
    //   this.parseData(res);
    // })
    try {
      await this.api.get('sicara/getAllPCM').then(res=>{ 
        this.listCabang = res;
        this.listCabang = this.listCabang.sort((a:any,b:any) => a.nama < b.nama ? -1:1)
      }, err => {
      });
    } catch {

    }
    try {
      await this.api.get('sicara/getAllPRM').then(res=>{
        this.listRanting = res;
        this.listRanting = this.listRanting.sort((a:any,b:any) => a.nama < b.nama ? -1:1)
      }, err => {
      });
    } catch {

    }
  }

  parseData(res:any) {
    for(var i=0; i<res.length; i++) {
      if(res[i].category == 'cabang') {
        let idx = this.listCabang.indexOf(res[i]);
        if(idx == -1) {
          this.listCabang.push(res[i]);
        }
      } else if(res[i].category == 'ranting') {
        let idx = this.listRanting.indexOf(res[i]);
        if(idx == -1) {
          this.listRanting.push(res[i]);
        }
      }
    }
  }

  urlRegEx = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?";
  save() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
    }
    else {
      if(this.form.get('url_livestream').value) {
        if(this.isValidUrl(this.form.get('url_livestream').value)) { 
        } else {
          Notiflix.Notify.failure('Masukkan url dengan format yang benar, contoh https://example.com',{ timeout: 2000 });
          return;
        }
      }

      this.pengajianData = this.form.value;
      if(new Date(this.dateValue) > this.today) {
        this.pengajianData.status = 'soon';
      } else {
        this.pengajianData.status = 'done';
      }
      this.timeValue = this.datePipe.transform(new Date(this.timeValue), 'HH:mm');
      let hours = this.timeValue.split(':')[0];
      let minutes = this.timeValue.split(':')[1];
      if(this.dateValue != undefined) {
        if(hours > 24) {
          Notiflix.Notify.failure('Pastikan format 24 jam!',{ timeout: 2000 });
        } else {
          this.pengajianData.datetime = this.dateValue.setHours(hours, minutes);
          this.pengajianData.datetime = new Date(this.pengajianData.datetime);
          if(this.isCreated == true) {
            this.pengajianData.id = new Date().getTime().toString() + '' + [Math.floor((Math.random() * 1000))];
            this.pengajianData.verified = false;
            this.pengajianData.created_by = this.userData.id;
            this.api.post('pengajian', this.pengajianData).then(res => {
              if(res) {
                Notiflix.Notify.success('Berhasil menambahkan data.',{ timeout: 2000 });
                this.dialogRef.close();
              }
            })
          } else {
            this.api.put('pengajian/'+this.pengajianData.id, this.pengajianData).then(res => {
              if(res) {
                Notiflix.Notify.success('Berhasil memperbarui data.',{ timeout: 2000 });
                this.dialogRef.close();
              }
            })
          }
        }
      } else {
        Notiflix.Notify.failure('Tentukan tanggal!',{ timeout: 2000 });
      }
    }
  }

  isValidUrl(urlString: string): boolean {
    try {
      let pattern = new RegExp(this.urlRegEx);
      let valid = pattern.test(urlString);
      return valid;
    } catch (TypeError) {
      return false;
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
