import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAgentDetailsComponent } from './service-agent-details.component';

describe('ServiceAgentDetailsComponent', () => {
  let component: ServiceAgentDetailsComponent;
  let fixture: ComponentFixture<ServiceAgentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceAgentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceAgentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
