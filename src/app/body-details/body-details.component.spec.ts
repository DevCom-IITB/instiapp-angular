import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyDetailsComponent } from './body-details.component';

describe('BodyDetailsComponent', () => {
  let component: BodyDetailsComponent;
  let fixture: ComponentFixture<BodyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
