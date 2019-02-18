import { Component, OnInit } from '@angular/core';
import { IComplaint } from '../../interfaces';
import { DataService } from '../../data.service';
import { API } from '../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VenterDataService } from '../venter-data.service';

@Component({
  selector: 'app-complaints-home',
  templateUrl: './complaints-home.component.html',
  styleUrls: ['./complaints-home.component.css'],
})
export class ComplaintsHomeComponent implements OnInit {

  public complaints = {} as IComplaint[];
  public myComplaints = {} as IComplaint[];
  public userid: string;
  public myComplaintsFlag: boolean;
  public complaintsFlag: boolean;

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public venterDataService: VenterDataService,
  ) { }

  ngOnInit() {
    this.complaints = [];
    this.myComplaints = [];
    /* Get profile if the user is logged in */
    if (this.dataService.isLoggedIn()) {
      this.getUser();
    }
    /* Set title */
    this.dataService.setTitle('Complaints & Suggestions');
    this.refresh();
  }

  getUser() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.userid = user.id;
    });
  }

  refresh() {
    /* Get all the complaints from server*/
    this.dataService.FireGET<IComplaint[]>(API.Complaints).subscribe(result => {
      this.complaints = result;
      if (this.complaints.length === 0) {
        this.complaintsFlag = true;
      } else {
        this.venterDataService.getComplaintInfo(this.complaints);
      }
    });
    /* Get the current user complaints from server*/
    this.dataService.FireGET<IComplaint[]>(API.MyComplaints).subscribe(result => {
      this.myComplaints = result;
      if (this.myComplaints.length === 0) {
        this.myComplaintsFlag = true;
      } else {
        this.venterDataService.getComplaintInfo(this.myComplaints);
      }
    });
  }
}
