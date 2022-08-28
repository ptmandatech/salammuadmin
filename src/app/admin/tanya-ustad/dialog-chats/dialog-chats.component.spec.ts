import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChatsComponent } from './dialog-chats.component';

describe('DialogChatsComponent', () => {
  let component: DialogChatsComponent;
  let fixture: ComponentFixture<DialogChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogChatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
