import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogArtikelmuComponent } from './dialog-artikelmu/dialog-artikelmu.component';

@Component({
  selector: 'app-artikelmu',
  templateUrl: './artikelmu.component.html',
  styleUrls: ['./artikelmu.component.scss']
})
export class ArtikelmuComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  //Dialog tambah/edit Artikel
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogArtikelmuComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
