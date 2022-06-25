import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogArtikelmuComponent } from './dialog-artikelmu.component';

describe('DialogArtikelmuComponent', () => {
  let component: DialogArtikelmuComponent;
  let fixture: ComponentFixture<DialogArtikelmuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogArtikelmuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogArtikelmuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
