import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogKhutbahComponent } from './dialog-khutbah/dialog-khutbah.component';

@Component({
  selector: 'app-khutbah',
  templateUrl: './khutbah.component.html',
  styleUrls: ['./khutbah.component.scss']
})
export class KhutbahComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  //Dialog Tambah/Edit Keilmuan
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogKhutbahComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
