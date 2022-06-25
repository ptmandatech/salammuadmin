import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KategoriProdukComponent } from './kategori-produk.component';

describe('KategoriProdukComponent', () => {
  let component: KategoriProdukComponent;
  let fixture: ComponentFixture<KategoriProdukComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KategoriProdukComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KategoriProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
