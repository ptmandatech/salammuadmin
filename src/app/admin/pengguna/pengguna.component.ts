import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogSettingRoleComponent } from './dialog-setting-role/dialog-setting-role.component';
import { DialogUpdatePasswordComponent } from './dialog-update-password/dialog-update-password.component';
import { DialogUserComponent } from './dialog-user/dialog-user.component';

@Component({
  selector: 'app-pengguna',
  templateUrl: './pengguna.component.html',
  styleUrls: ['./pengguna.component.scss']
})
export class PenggunaComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  //Dialog Tambah/Edit Pengguna
  dialogPengguna(): void {
    const dialogRef = this.dialog.open(DialogUserComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  //Dialog Edit Role
  editRole(): void {
    const dialogRef = this.dialog.open(DialogSettingRoleComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  //Dialog Edit Password
  updatePassword(): void {
    const dialogRef = this.dialog.open(DialogUpdatePasswordComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
