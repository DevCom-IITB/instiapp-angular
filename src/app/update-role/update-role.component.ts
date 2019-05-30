import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IBodyRole, IUserProfile } from '../interfaces';
import { DataService } from '../data.service';
import { API } from '../../api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public snackBar: MatSnackBar,
  ) {
    this.addForm = new FormControl();
  }

  ngOnInit() {
    if (this.minrole.editing) {
      /* Modifying an existing role */
      this.dataService.FireGET<IBodyRole>(API.Role, { uuid: this.minrole.id }).subscribe(result => {
        this.role = result;
      });
    } else {
      /* Making a new role */
      this.role = this.minrole;
    }

    this.explorePeople = this.addForm.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(val => {
        return this.explore(val);
      })
    );
  }

  /** Return an observable with explored profiles */
  explore(query: string): Observable<IUserProfile[]> {
    return new Observable(observer => {
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

  /** Remove a user from role */
  removePerson(user: IUserProfile) {
    this.role.users_detail.splice(this.role.users_detail.indexOf(user), 1);
    this.role.users.splice(this.role.users.indexOf(user.id), 1);
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
    let obs: Observable<IBodyRole>;

    if (this.minrole.id && this.minrole.id !== '') {
      obs = this.dataService.FirePUT<IBodyRole>(API.Role, this.role, { uuid: this.role.id });
    } else {
      obs = this.dataService.FirePOST<IBodyRole>(API.Roles, this.role);
    }

    /* Make the request */
    obs.subscribe(result => {
      this.snackBar.open('Role Updated', 'Dismiss', { duration: 2000 });
      this.doneUpdate.emit(result);
    }, () => {
      this.snackBar.open('Update Failed', 'Dismiss', { duration: 2000 });
    });
  }

  /* Delete the role */
  delete() {
    if (confirm('Delete this role? This action is irreversible')) {
      this.dataService.FireDELETE(API.Role, { uuid: this.role.id }).subscribe(() => {
        this.snackBar.open('Role Deleted', 'Dismiss', { duration: 2000 });
        (this.role as any).deleted = true;
        this.doneUpdate.emit(this.role);
      }, () => {
        this.snackBar.open('Deletion Failed! Note that you may not delete roles held by people in the past.', 'Dismiss');
      });
    }
  }

  /* Toggle inheritability */
  toggleInheritable() {
    this.role.inheritable = !this.role.inheritable;
  }

  /** Cancel the edit */
  cancel() {
    this.role.editing = true;
    this.doneUpdate.emit(this.role);
  }
}
