import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseImageOrVideoComponent } from './browse-image-or-video.component';

describe('BrowseImageOrVideoComponent', () => {
  let component: BrowseImageOrVideoComponent;
  let fixture: ComponentFixture<BrowseImageOrVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseImageOrVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseImageOrVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
