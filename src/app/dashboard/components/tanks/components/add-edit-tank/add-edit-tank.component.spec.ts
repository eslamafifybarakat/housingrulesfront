import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTankComponent } from './add-edit-tank.component';

describe('AddEditTankComponent', () => {
  let component: AddEditTankComponent;
  let fixture: ComponentFixture<AddEditTankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
