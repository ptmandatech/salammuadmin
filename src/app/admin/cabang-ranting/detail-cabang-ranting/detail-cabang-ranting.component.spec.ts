import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCabangRantingComponent } from './detail-cabang-ranting.component';

describe('DetailCabangRantingComponent', () => {
  let component: DetailCabangRantingComponent;
  let fixture: ComponentFixture<DetailCabangRantingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCabangRantingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCabangRantingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
