import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNotulenmuComponent } from './dialog-notulenmu.component';

describe('DialogNotulenmuComponent', () => {
  let component: DialogNotulenmuComponent;
  let fixture: ComponentFixture<DialogNotulenmuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNotulenmuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNotulenmuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
