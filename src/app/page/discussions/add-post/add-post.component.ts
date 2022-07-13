import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';

import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig, } from "@angular/material/dialog";
import { ClosePopupComponent } from './close-popup/close-popup.component';

const DEFAULT_USERNAME = 'Guest';
const DEFAULT_LDAP = 'IITB User';
const DEFAULT_PROFILE_PIC = 'assets/useravatar.svg';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  public userName = DEFAULT_USERNAME;
  public ldap = DEFAULT_LDAP;
  public profilePic = DEFAULT_PROFILE_PIC;
  content_border = 'none';

  taggables: String[];
  
  constructor(
    public dataService: DataService,
    private dialog : MatDialog,
    public dialogRef : MatDialogRef<AddPostComponent>,
  ) { }

  ngOnInit(): void {
    this.dataService.setTitle("Create post")
    this.populateDummyData();
  }

  populateDummyData(): void{
    this.taggables = new Array<String>();

    this.taggables.push("ISHA");
    this.taggables.push("GSCA");
    this.taggables.push("EESA");
    this.taggables.push("DevCom");

  }

  onPost(){
    this.dialogRef.close();
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = "30%";
    dialogConfig.height = "20%";
    dialogConfig.position = {top:'200px' };
    dialogConfig.panelClass= 'custom-container';
    this.dialog.open(ClosePopupComponent, dialogConfig);
  }

}
