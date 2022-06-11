import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightDisscussionForumComponent } from './insight-disscussion-forum.component';

describe('InsightDisscussionForumComponent', () => {
  let component: InsightDisscussionForumComponent;
  let fixture: ComponentFixture<InsightDisscussionForumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightDisscussionForumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightDisscussionForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
