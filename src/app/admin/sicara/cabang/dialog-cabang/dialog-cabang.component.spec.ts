import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCabangComponent } from './dialog-cabang.component';

describe('DialogCabangComponent', () => {
  let component: DialogCabangComponent;
  let fixture: ComponentFixture<DialogCabangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCabangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCabangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
