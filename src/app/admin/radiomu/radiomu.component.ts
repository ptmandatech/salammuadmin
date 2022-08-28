import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogRadioComponent } from './dialog-radio/dialog-radio.component';

@Component({
  selector: 'app-radiomu',
  templateUrl: './radiomu.component.html',
  styleUrls: ['./radiomu.component.scss']
})
export class RadiomuComponent implements OnInit {

  constructor(public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  //Dialog Tambah/Edit Radio
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogRadioComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}
