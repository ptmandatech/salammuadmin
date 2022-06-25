import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDoaDzikirComponent } from './dialog-doa-dzikir.component';

describe('DialogDoaDzikirComponent', () => {
  let component: DialogDoaDzikirComponent;
  let fixture: ComponentFixture<DialogDoaDzikirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDoaDzikirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDoaDzikirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
