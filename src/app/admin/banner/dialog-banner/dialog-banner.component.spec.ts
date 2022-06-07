import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBannerComponent } from './dialog-banner.component';

describe('DialogBannerComponent', () => {
  let component: DialogBannerComponent;
  let fixture: ComponentFixture<DialogBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
