import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUstadzComponent } from './dialog-ustadz.component';

describe('DialogUstadzComponent', () => {
  let component: DialogUstadzComponent;
  let fixture: ComponentFixture<DialogUstadzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUstadzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUstadzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
