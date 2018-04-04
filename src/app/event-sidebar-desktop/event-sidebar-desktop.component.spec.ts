import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSidebarDesktopComponent } from './event-sidebar-desktop.component';

describe('EventSidebarDesktopComponent', () => {
  let component: EventSidebarDesktopComponent;
  let fixture: ComponentFixture<EventSidebarDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSidebarDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSidebarDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
