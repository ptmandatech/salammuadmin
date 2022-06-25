import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogKategoriProdukComponent } from './dialog-kategori-produk.component';

describe('DialogKategoriProdukComponent', () => {
  let component: DialogKategoriProdukComponent;
  let fixture: ComponentFixture<DialogKategoriProdukComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogKategoriProdukComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogKategoriProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
