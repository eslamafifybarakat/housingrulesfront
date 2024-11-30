import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAddressedPlacesComponent } from './add-edit-addressed-places.component';

describe('AddEditAddressedPlacesComponent', () => {
  let component: AddEditAddressedPlacesComponent;
  let fixture: ComponentFixture<AddEditAddressedPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAddressedPlacesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAddressedPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
