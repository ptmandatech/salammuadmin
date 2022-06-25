import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-dialog-setting-role',
  templateUrl: './dialog-setting-role.component.html',
  styleUrls: ['./dialog-setting-role.component.scss']
})
export class DialogSettingRoleComponent implements OnInit {

  role = new FormControl('');
  RoleList: string[] = ['Editor', 'Superadmin', 'Admin Produk', 'Admin CR'];

  constructor() { }

  ngOnInit(): void {
  }

}
