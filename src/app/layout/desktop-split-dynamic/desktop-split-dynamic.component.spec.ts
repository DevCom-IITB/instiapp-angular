import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopSplitDynamicComponent } from './desktop-split-dynamic.component';

describe('DesktopSplitDynamicComponent', () => {
  let component: DesktopSplitDynamicComponent;
  let fixture: ComponentFixture<DesktopSplitDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopSplitDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopSplitDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
