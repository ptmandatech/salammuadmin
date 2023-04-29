import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailNotulenmuComponent } from './detail-notulenmu.component';

describe('DetailNotulenmuComponent', () => {
  let component: DetailNotulenmuComponent;
  let fixture: ComponentFixture<DetailNotulenmuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailNotulenmuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailNotulenmuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
