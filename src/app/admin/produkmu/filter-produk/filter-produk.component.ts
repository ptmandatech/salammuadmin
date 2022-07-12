import { Component, Inject, OnInit } from '@angular/core';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-filter-produk',
  templateUrl: './filter-produk.component.html',
  styleUrls: ['./filter-produk.component.scss']
})
export class FilterProdukComponent implements OnInit {

  katCtrl = new FormControl('');
  filteredKat: Observable<string[]>;
  kat: string[] = [];
  allFruits: string[] = ['Furniture', 'Makanan', 'Minuman', 'Pakaian', 'Sepatu'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<FilterProdukComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
  ) {
    this.filteredKat = this.katCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
    
    if(sourceData.data != null) {
      this.filterData = sourceData.data;
    } else {
      this.filterData.status = 'all';
      this.filterData.fav = 'all';
    }
  }

  ngOnInit(): void {
    
  }

  remove(fruit: string): void {
    const index = this.kat.indexOf(fruit);

    if (index >= 0) {
      this.kat.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.kat.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.katCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  filterData:any = {};
  selectStatus(status:any) {
    this.filterData.status = status;
  }

  selectFav(status:any) {
    this.filterData.fav = status;
  }

  save() {
    this.dialogRef.close(this.filterData);
  }

  reset() {
    this.filterData.status = 'all';
    this.filterData.fav = 'all';
    this.dialogRef.close(this.filterData);
  }

}
