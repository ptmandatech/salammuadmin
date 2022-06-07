import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoaDzikirComponent } from './doa-dzikir.component';

describe('DoaDzikirComponent', () => {
  let component: DoaDzikirComponent;
  let fixture: ComponentFixture<DoaDzikirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoaDzikirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoaDzikirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
