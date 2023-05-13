import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditServiceAgentComponent } from './add-edit-service-agent.component';

describe('AddEditServiceAgentComponent', () => {
  let component: AddEditServiceAgentComponent;
  let fixture: ComponentFixture<AddEditServiceAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditServiceAgentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditServiceAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
