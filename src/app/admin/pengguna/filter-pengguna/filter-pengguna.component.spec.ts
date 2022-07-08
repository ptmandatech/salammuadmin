import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPenggunaComponent } from './filter-pengguna.component';

describe('FilterPenggunaComponent', () => {
  let component: FilterPenggunaComponent;
  let fixture: ComponentFixture<FilterPenggunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterPenggunaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPenggunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
