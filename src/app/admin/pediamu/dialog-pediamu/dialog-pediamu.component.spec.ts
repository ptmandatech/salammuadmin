import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPediamuComponent } from './dialog-pediamu.component';

describe('DialogPediamuComponent', () => {
  let component: DialogPediamuComponent;
  let fixture: ComponentFixture<DialogPediamuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPediamuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPediamuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
