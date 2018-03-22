import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyCardComponent } from './body-card.component';

describe('BodyCardComponent', () => {
  let component: BodyCardComponent;
  let fixture: ComponentFixture<BodyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
