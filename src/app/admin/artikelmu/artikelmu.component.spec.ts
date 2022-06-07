import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtikelmuComponent } from './artikelmu.component';

describe('ArtikelmuComponent', () => {
  let component: ArtikelmuComponent;
  let fixture: ComponentFixture<ArtikelmuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtikelmuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtikelmuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
