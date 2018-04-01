import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementBlogComponent } from './placement-blog.component';

describe('PlacementBlogComponent', () => {
  let component: PlacementBlogComponent;
  let fixture: ComponentFixture<PlacementBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacementBlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
