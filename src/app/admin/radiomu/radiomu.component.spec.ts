import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiomuComponent } from './radiomu.component';

describe('RadiomuComponent', () => {
  let component: RadiomuComponent;
  let fixture: ComponentFixture<RadiomuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiomuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiomuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
