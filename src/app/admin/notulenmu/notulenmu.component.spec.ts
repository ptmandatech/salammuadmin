import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotulenmuComponent } from './notulenmu.component';

describe('NotulenmuComponent', () => {
  let component: NotulenmuComponent;
  let fixture: ComponentFixture<NotulenmuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotulenmuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotulenmuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
