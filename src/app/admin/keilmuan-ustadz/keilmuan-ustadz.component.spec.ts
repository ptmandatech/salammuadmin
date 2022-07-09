import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeilmuanUstadzComponent } from './keilmuan-ustadz.component';

describe('KeilmuanUstadzComponent', () => {
  let component: KeilmuanUstadzComponent;
  let fixture: ComponentFixture<KeilmuanUstadzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeilmuanUstadzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeilmuanUstadzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
