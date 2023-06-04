import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogKonfigurasiComponent } from './dialog-konfigurasi.component';

describe('DialogKonfigurasiComponent', () => {
  let component: DialogKonfigurasiComponent;
  let fixture: ComponentFixture<DialogKonfigurasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogKonfigurasiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogKonfigurasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
