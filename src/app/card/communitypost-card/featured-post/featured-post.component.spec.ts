import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedPostComponent } from './featured-post.component';

describe('FeaturedPostComponent', () => {
  let component: FeaturedPostComponent;
  let fixture: ComponentFixture<FeaturedPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
