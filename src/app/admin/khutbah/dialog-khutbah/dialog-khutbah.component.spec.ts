import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogKhutbahComponent } from './dialog-khutbah.component';

describe('DialogKhutbahComponent', () => {
  let component: DialogKhutbahComponent;
  let fixture: ComponentFixture<DialogKhutbahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogKhutbahComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogKhutbahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
