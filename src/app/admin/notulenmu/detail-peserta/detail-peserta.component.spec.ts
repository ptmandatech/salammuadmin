import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPesertaComponent } from './detail-peserta.component';

describe('DetailPesertaComponent', () => {
  let component: DetailPesertaComponent;
  let fixture: ComponentFixture<DetailPesertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPesertaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPesertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
