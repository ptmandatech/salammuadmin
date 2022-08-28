import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRantingComponent } from './dialog-ranting.component';

describe('DialogRantingComponent', () => {
  let component: DialogRantingComponent;
  let fixture: ComponentFixture<DialogRantingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRantingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRantingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
