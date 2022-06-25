import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogKategoriProdukComponent } from './dialog-kategori-produk/dialog-kategori-produk.component';

@Component({
  selector: 'app-kategori-produk',
  templateUrl: './kategori-produk.component.html',
  styleUrls: ['./kategori-produk.component.scss']
})
export class KategoriProdukComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  //Dialog tambah/edit kategori
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogKategoriProdukComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}
