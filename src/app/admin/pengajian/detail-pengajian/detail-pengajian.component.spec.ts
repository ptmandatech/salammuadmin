import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPengajianComponent } from './detail-pengajian.component';

describe('DetailPengajianComponent', () => {
  let component: DetailPengajianComponent;
  let fixture: ComponentFixture<DetailPengajianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPengajianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPengajianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
