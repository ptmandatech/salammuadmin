import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RantingComponent } from './ranting.component';

describe('RantingComponent', () => {
  let component: RantingComponent;
  let fixture: ComponentFixture<RantingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RantingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RantingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
