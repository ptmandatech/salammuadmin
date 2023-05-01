import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNotifikasiComponent } from './dialog-notifikasi.component';

describe('DialogNotifikasiComponent', () => {
  let component: DialogNotifikasiComponent;
  let fixture: ComponentFixture<DialogNotifikasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNotifikasiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNotifikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
