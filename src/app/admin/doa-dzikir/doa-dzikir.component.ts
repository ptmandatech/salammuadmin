import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogDoaDzikirComponent } from './dialog-doa-dzikir/dialog-doa-dzikir.component';

@Component({
  selector: 'app-doa-dzikir',
  templateUrl: './doa-dzikir.component.html',
  styleUrls: ['./doa-dzikir.component.scss']
})
export class DoaDzikirComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  //Dialog tambah/edit video
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogDoaDzikirComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
