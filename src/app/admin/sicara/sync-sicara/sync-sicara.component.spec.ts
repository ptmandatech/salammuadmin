import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncSicaraComponent } from './sync-sicara.component';

describe('SyncSicaraComponent', () => {
  let component: SyncSicaraComponent;
  let fixture: ComponentFixture<SyncSicaraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyncSicaraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncSicaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
