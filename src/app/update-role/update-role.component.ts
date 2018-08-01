import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IBodyRole, IUserProfile } from '../interfaces';
import { DataService } from '../data.service';
import { API } from '../../api';
import { FormControl } from '../../../node_modules/@angular/forms';
import { Observable } from '../../../node_modules/rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.css']
})
export class UpdateRoleComponent implements OnInit {

  @Input() minrole: IBodyRole;
  @Output() public doneUpdate = new EventEmitter<IBodyRole>();
  role: IBodyRole;
  addForm: FormControl;
  explorePeople: Observable<IUserProfile[]>;

  possiblePermissions = [
    {name: 'Add Event', code: 'AddE'},
    {name: 'Edit Event', code: 'UpdE'},
    {name: 'Delete Event', code: 'DelE'},
    {name: 'Update Body', code: 'UpdB'},
    {name: 'Modify Roles', code: 'Role'},
  ];

  constructor(
    public dataService: DataService,
  ) {
    this.addForm = new FormControl();
  }

  ngOnInit() {
    this.dataService.FireGET<IBodyRole>(API.Role, { uuid: this.minrole.id }).subscribe(result => {
      this.role = result;
    });

    this.explorePeople = this.addForm.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(val => {
        return this.explore(val);
      })
    );
  }

  /** Return an observable with explored profiles */
  explore(query: string): Observable<IUserProfile[]> {
    return Observable.create(observer => {
      if (!query || query.length < 3) {
        observer.next([]);
        observer.complete();
      } else {
        this.dataService.FireGET<any>(API.Search, { query: query }).subscribe(result => {
            observer.next(result.users);
            observer.complete();
        }, (error) => observer.error(error));
      }
    });
  }

  /** Add a person to a role from an autocomplete event */
  addPerson(event: any) {
    const person: IUserProfile = event.option.value;
    this.role.users_detail.push(person);
    this.role.users.push(person.id);
    this.addForm.setValue('');
  }

  /** Returns true if the role has permission with code */
  hasPermission(code: string) {
    return this.role.permissions.includes(code);
  }

  /** Removes existing permission and vice versa */
  togglePermission(code: string) {
    if (this.hasPermission(code)) {
      const index = this.role.permissions.indexOf(code);
      this.role.permissions.splice(index, 1);
    } else {
      this.role.permissions.push(code);
    }
  }

  /** PUT the role */
  submit() {
    this.dataService.FirePUT<IBodyRole>(API.Role, this.role, { uuid: this.role.id }).subscribe(result => {
      this.doneUpdate.emit(result);
    });
  }
}
