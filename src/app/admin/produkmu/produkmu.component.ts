import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogProdukmuComponent } from './dialog-produkmu/dialog-produkmu.component';

@Component({
  selector: 'app-produkmu',
  templateUrl: './produkmu.component.html',
  styleUrls: ['./produkmu.component.scss']
})
export class ProdukmuComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  //Dialog tambah/edit produk
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogProdukmuComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
