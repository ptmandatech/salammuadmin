import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-notulenmu',
  templateUrl: './notulenmu.component.html',
  styleUrls: ['./notulenmu.component.scss']
})
export class NotulenmuComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  constructor() { }

  ngOnInit(): void {
  }

}
