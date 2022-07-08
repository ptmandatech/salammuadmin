import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProdukComponent } from './filter-produk.component';

describe('FilterProdukComponent', () => {
  let component: FilterProdukComponent;
  let fixture: ComponentFixture<FilterProdukComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterProdukComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
