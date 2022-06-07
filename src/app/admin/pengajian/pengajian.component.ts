import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPengajianComponent } from './dialog-pengajian/dialog-pengajian.component';
import Swal from 'sweetalert2';
import { DetailPengajianComponent } from './detail-pengajian/detail-pengajian.component';

@Component({
  selector: 'app-pengajian',
  templateUrl: './pengajian.component.html',
  styleUrls: ['./pengajian.component.scss']
})
export class PengajianComponent implements OnInit {

  constructor(public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  //Dialog tambah/edit banner
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogPengajianComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  //Dialog verifikasi
  openDetail(): void {
    const dialogRef = this.dialog.open(DetailPengajianComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  delete() {
    Swal.fire({
      title: 'Anda Yakin ingin menghapus data ?',
      text: "Data yang telah terhapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Data Berhasil di Hapus',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

}
