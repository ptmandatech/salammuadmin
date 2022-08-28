import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TanyaUstadComponent } from './tanya-ustad.component';

describe('TanyaUstadComponent', () => {
  let component: TanyaUstadComponent;
  let fixture: ComponentFixture<TanyaUstadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TanyaUstadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TanyaUstadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
