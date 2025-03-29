import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../data.service';
import { API } from '../../../api';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.css'],
    standalone: false
})
export class SearchBoxComponent implements OnInit {

  @Input() exploreProp = 'users';
  @Input() displayProp = 'name';
  @Input() placeholder = 'Add Person';
  @Input() hint = 'Enter a name or roll number';
  @Output() change = new EventEmitter<any>();


  addForm: UntypedFormControl;
  exploreObs: Observable<any[]>;

  constructor(
    public dataService: DataService,
  ) {
    this.addForm = new UntypedFormControl();
  }

  ngOnInit() {


    this.exploreObs = this.addForm.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(val => {
        return this.explore(val);
      })
    );
  }

  /** Return an observable with explored profiles */
  explore(query: string): Observable<any[]> {
    return new Observable(observer => {
      if (!query || query.length < 3) {
        observer.next([]);
        observer.complete();
      } else {
        this.dataService.FireGET<any>(API.Search, { query: query, types: this.exploreProp }).subscribe(result => {
          observer.next(result[this.exploreProp]);
          observer.complete();
        }, (error) => observer.error(error));
      }
    });
  }

  /** Fire on selection */
  selected(event: any): void {
    if (event.option) {
      this.change.emit(event);
      this.addForm.setValue('');
    }
  }
}
