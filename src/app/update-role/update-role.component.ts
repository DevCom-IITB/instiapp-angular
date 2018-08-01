import { Component, OnInit, Input } from '@angular/core';
import { IBodyRole } from '../interfaces';
import { DataService } from '../data.service';
import { API } from '../../api';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.css']
})
export class UpdateRoleComponent implements OnInit {

  @Input() minrole: IBodyRole;
  role: IBodyRole;

  possiblePermissions = [
    {name: 'Add Event', code: 'AddE'},
    {name: 'Edit Event', code: 'UpdE'},
    {name: 'Delete Event', code: 'DelE'},
    {name: 'Update Body', code: 'UpdB'},
    {name: 'Modify Roles', code: 'Role'},
  ];

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.FireGET<IBodyRole>(API.Role, { uuid: this.minrole.id }).subscribe(result => {
      this.role = result;
    });
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
}
