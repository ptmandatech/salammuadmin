import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUstadzComponent } from './dialog-ustadz/dialog-ustadz.component';

@Component({
  selector: 'app-ustadz',
  templateUrl: './ustadz.component.html',
  styleUrls: ['./ustadz.component.scss']
})
export class UstadzComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  //Dialog Tambah/Edit Ustdaz
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogUstadzComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
