import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaerahComponent } from './daerah.component';

describe('DaerahComponent', () => {
  let component: DaerahComponent;
  let fixture: ComponentFixture<DaerahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaerahComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaerahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
