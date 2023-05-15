import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAgentComponent } from './service-agent.component';

describe('ServiceAgentComponent', () => {
  let component: ServiceAgentComponent;
  let fixture: ComponentFixture<ServiceAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceAgentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
