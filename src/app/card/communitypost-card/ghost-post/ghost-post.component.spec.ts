import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostPostComponent } from './ghost-post.component';

describe('GhostPostComponent', () => {
  let component: GhostPostComponent;
  let fixture: ComponentFixture<GhostPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhostPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhostPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
