import { Component, OnInit } from '@angular/core';
import {ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
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

  constructor() {
    this.filteredKat = this.katCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
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

}
