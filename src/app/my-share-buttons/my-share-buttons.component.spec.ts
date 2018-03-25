import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyShareButtonsComponent } from './my-share-buttons.component';

describe('MyShareButtonsComponent', () => {
  let component: MyShareButtonsComponent;
  let fixture: ComponentFixture<MyShareButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyShareButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyShareButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
