import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-pengajian',
  templateUrl: './filter-pengajian.component.html',
  styleUrls: ['./filter-pengajian.component.scss']
})
export class FilterPengajianComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FilterPengajianComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
  ) { 
    
    if(sourceData.data != null) {
      this.filterData = sourceData.data;
    } else {
      this.filterData.status = 'all';
    }
  }

  ngOnInit(): void {
  }

  filterData:any = {};
  selectStatus(status:any) {
    this.filterData.status = status;
  }

  save() {
    this.dialogRef.close(this.filterData);
  }

  reset() {
    this.filterData.status = 'all';
    this.filterData.tglPengajian = undefined;
    this.filterData.created_at = undefined;
    this.dialogRef.close(this.filterData);
  }

}
