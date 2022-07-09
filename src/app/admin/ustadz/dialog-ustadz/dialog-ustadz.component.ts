import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-dialog-ustadz',
  templateUrl: './dialog-ustadz.component.html',
  styleUrls: ['./dialog-ustadz.component.scss']
})
export class DialogUstadzComponent implements OnInit {

  constructor() { }

  prov = new FormControl('');
  kab = new FormControl('');
  kec = new FormControl('');
  optionsProv: string[] = ['DKI Jakarta', 'Yogykarta', 'Semarang'];
  optionsKab: string[] = ['Bantul', 'Sleman', 'Gunung Kidul'];
  optionsKec: string[] = ['Mugowharjo', 'Depok', 'Umbulharjo'];
  filteredOptionsProv: Observable<string[]>;
  filteredOptionsKab: Observable<string[]>;
  filteredOptionsKec: Observable<string[]>;

  ngOnInit(): void {
    this.filteredOptionsProv = this.prov.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProv(value || '')),
    );

    this.filteredOptionsKab = this.kab.valueChanges.pipe(
      startWith(''),
      map(value => this._filterKab(value || '')),
    );

    this.filteredOptionsKec = this.kec.valueChanges.pipe(
      startWith(''),
      map(value => this._filterKec(value || '')),
    );
  }

  private _filterProv(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsProv.filter(optionsProv => optionsProv.toLowerCase().includes(filterValue));
  }

  private _filterKab(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsKab.filter(optionsKab => optionsKab.toLowerCase().includes(filterValue));
  }

  private _filterKec(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsKec.filter(optionsKec => optionsKec.toLowerCase().includes(filterValue));
  }

}
