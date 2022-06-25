import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPediamuComponent } from './dialog-pediamu/dialog-pediamu.component';

@Component({
  selector: 'app-pediamu',
  templateUrl: './pediamu.component.html',
  styleUrls: ['./pediamu.component.scss']
})
export class PediamuComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  //Dialog tambah/edit Pediamu
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogPediamuComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
