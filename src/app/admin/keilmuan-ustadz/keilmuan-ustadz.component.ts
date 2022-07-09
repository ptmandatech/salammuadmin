import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogKeilmuanUstadzComponent } from './dialog-keilmuan-ustadz/dialog-keilmuan-ustadz.component';

@Component({
  selector: 'app-keilmuan-ustadz',
  templateUrl: './keilmuan-ustadz.component.html',
  styleUrls: ['./keilmuan-ustadz.component.scss']
})
export class KeilmuanUstadzComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

   //Dialog Tambah/Edit Keilmuan
   openDialog(): void {
    const dialogRef = this.dialog.open(DialogKeilmuanUstadzComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
