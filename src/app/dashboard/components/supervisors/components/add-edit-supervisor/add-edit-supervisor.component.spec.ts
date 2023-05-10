import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSupervisorComponent } from './add-edit-supervisor.component';

describe('AddEditSupervisorComponent', () => {
  let component: AddEditSupervisorComponent;
  let fixture: ComponentFixture<AddEditSupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSupervisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
