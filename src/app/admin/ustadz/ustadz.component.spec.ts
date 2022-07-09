import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UstadzComponent } from './ustadz.component';

describe('UstadzComponent', () => {
  let component: UstadzComponent;
  let fixture: ComponentFixture<UstadzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UstadzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UstadzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
