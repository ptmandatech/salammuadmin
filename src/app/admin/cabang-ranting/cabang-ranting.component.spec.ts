import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabangRantingComponent } from './cabang-ranting.component';

describe('CabangRantingComponent', () => {
  let component: CabangRantingComponent;
  let fixture: ComponentFixture<CabangRantingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabangRantingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabangRantingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
