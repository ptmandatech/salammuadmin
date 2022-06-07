import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengajianComponent } from './pengajian.component';

describe('PengajianComponent', () => {
  let component: PengajianComponent;
  let fixture: ComponentFixture<PengajianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PengajianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PengajianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
