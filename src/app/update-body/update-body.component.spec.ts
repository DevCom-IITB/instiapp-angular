import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBodyComponent } from './update-body.component';

describe('UpdateBodyComponent', () => {
  let component: UpdateBodyComponent;
  let fixture: ComponentFixture<UpdateBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
