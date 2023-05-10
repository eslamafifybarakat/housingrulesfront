import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TanksComponent } from './tanks.component';

describe('TanksComponent', () => {
  let component: TanksComponent;
  let fixture: ComponentFixture<TanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TanksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
