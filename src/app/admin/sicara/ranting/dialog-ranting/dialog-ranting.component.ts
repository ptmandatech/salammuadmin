import { Component, OnInit } from '@angular/core';
import Quill from 'quill';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-dialog-ranting',
  templateUrl: './dialog-ranting.component.html',
  styleUrls: ['./dialog-ranting.component.scss']
})
export class DialogRantingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  byPassedHTMLString:any;
  modules = {
    toolbar: [
      ['image', 'video']
    ]
  }

}
