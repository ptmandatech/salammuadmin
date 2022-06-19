import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCabangRantingComponent } from './dialog-cabang-ranting.component';

describe('DialogCabangRantingComponent', () => {
  let component: DialogCabangRantingComponent;
  let fixture: ComponentFixture<DialogCabangRantingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCabangRantingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCabangRantingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
