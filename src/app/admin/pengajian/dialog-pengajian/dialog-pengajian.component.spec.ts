import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPengajianComponent } from './dialog-pengajian.component';

describe('DialogPengajianComponent', () => {
  let component: DialogPengajianComponent;
  let fixture: ComponentFixture<DialogPengajianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPengajianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPengajianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
