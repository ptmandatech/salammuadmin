import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PediamuComponent } from './pediamu.component';

describe('PediamuComponent', () => {
  let component: PediamuComponent;
  let fixture: ComponentFixture<PediamuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PediamuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PediamuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
