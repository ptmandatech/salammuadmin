import { Component, OnInit } from '@angular/core';

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


  constructor() { }

  ngOnInit(): void {
  }

}
