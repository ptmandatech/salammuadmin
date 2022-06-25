import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRolePermissionComponent } from './dialog-role-permission.component';

describe('DialogRolePermissionComponent', () => {
  let component: DialogRolePermissionComponent;
  let fixture: ComponentFixture<DialogRolePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRolePermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRolePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
