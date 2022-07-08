import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPengajianComponent } from './filter-pengajian.component';

describe('FilterPengajianComponent', () => {
  let component: FilterPengajianComponent;
  let fixture: ComponentFixture<FilterPengajianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterPengajianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPengajianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
