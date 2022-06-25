import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSettingRoleComponent } from './dialog-setting-role.component';

describe('DialogSettingRoleComponent', () => {
  let component: DialogSettingRoleComponent;
  let fixture: ComponentFixture<DialogSettingRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSettingRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSettingRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
