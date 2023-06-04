import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonfigurasiComponent } from './konfigurasi.component';

describe('KonfigurasiComponent', () => {
  let component: KonfigurasiComponent;
  let fixture: ComponentFixture<KonfigurasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KonfigurasiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KonfigurasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
