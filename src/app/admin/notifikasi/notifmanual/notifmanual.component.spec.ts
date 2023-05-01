import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifmanualComponent } from './notifmanual.component';

describe('NotifmanualComponent', () => {
  let component: NotifmanualComponent;
  let fixture: ComponentFixture<NotifmanualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifmanualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifmanualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
