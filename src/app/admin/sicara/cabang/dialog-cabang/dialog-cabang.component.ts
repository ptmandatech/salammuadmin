import { Component, OnInit } from '@angular/core';
import Quill from 'quill';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-dialog-cabang',
  templateUrl: './dialog-cabang.component.html',
  styleUrls: ['./dialog-cabang.component.scss']
})
export class DialogCabangComponent implements OnInit {

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
