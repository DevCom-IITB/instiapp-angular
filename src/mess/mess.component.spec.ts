import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessComponent } from './mess.component';

describe('MessComponent', () => {
  let component: MessComponent;
  let fixture: ComponentFixture<MessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
