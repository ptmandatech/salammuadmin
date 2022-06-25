import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdukmuComponent } from './produkmu.component';

describe('ProdukmuComponent', () => {
  let component: ProdukmuComponent;
  let fixture: ComponentFixture<ProdukmuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdukmuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdukmuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
