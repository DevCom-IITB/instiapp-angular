import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySearchComponent } from './query-search.component';

describe('QuerySearchComponent', () => {
  let component: QuerySearchComponent;
  let fixture: ComponentFixture<QuerySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuerySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
