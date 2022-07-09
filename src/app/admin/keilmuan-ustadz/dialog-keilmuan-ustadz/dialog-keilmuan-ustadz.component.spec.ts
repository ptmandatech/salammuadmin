import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogKeilmuanUstadzComponent } from './dialog-keilmuan-ustadz.component';

describe('DialogKeilmuanUstadzComponent', () => {
  let component: DialogKeilmuanUstadzComponent;
  let fixture: ComponentFixture<DialogKeilmuanUstadzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogKeilmuanUstadzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogKeilmuanUstadzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
