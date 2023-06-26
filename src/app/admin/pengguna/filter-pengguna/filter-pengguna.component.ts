import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import * as Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

@Component({
  selector: 'app-filter-pengguna',
  templateUrl: './filter-pengguna.component.html',
  styleUrls: ['./filter-pengguna.component.scss']
})
export class FilterPenggunaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FilterPenggunaComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private api: ApiService
  ) {
    Loading.pulse();
    if(sourceData.data != null) {
      this.filterData = sourceData.data;
    } else {
      this.filterData.statusAsManagement = 'all';
      this.filterData.status = 'all';
      this.filterData.role = 'all';
    }
  }

  ngOnInit(): void {
    this.allRoles.push({
      id: 'all',
      name: 'Semua'
    });
    this.getAllRoles();
  }

  allRoles:any = [];
  async getAllRoles() {
    await this.api.get('roles?all').then(res=>{
      let data = [...this.allRoles,...res];
      this.allRoles = data;
      Loading.remove();
    }, err => {
      Loading.remove();
      Notiflix.Notify.failure(JSON.stringify(err.error.status),{ timeout: 2000 });
    });
  }

  filterData:any = {};
  selectStatus(status:any) {
    this.filterData.status = status;
  }
  
  selectstatusAsManagement(status:any) {
    this.filterData.statusAsManagement = status;
  }

  selectRole(role:any) {
    this.filterData.role = role;
  }

  save() {
    this.dialogRef.close(this.filterData);
  }

  reset() {
    this.filterData.status = 'all';
    this.filterData.statusAsManagement = 'all';
    this.filterData.role = 'all';
    this.dialogRef.close(this.filterData);
  }

}
