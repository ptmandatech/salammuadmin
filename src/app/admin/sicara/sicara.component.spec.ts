import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SicaraComponent } from './sicara.component';

describe('SicaraComponent', () => {
  let component: SicaraComponent;
  let fixture: ComponentFixture<SicaraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SicaraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SicaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
