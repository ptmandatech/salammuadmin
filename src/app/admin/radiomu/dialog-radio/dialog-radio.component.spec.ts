import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRadioComponent } from './dialog-radio.component';

describe('DialogRadioComponent', () => {
  let component: DialogRadioComponent;
  let fixture: ComponentFixture<DialogRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRadioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
