import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProdukmuComponent } from './dialog-produkmu.component';

describe('DialogProdukmuComponent', () => {
  let component: DialogProdukmuComponent;
  let fixture: ComponentFixture<DialogProdukmuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProdukmuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProdukmuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
