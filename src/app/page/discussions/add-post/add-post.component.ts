import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';

import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig, } from "@angular/material/dialog";
import { ClosePopupComponent } from './close-popup/close-popup.component';

const DEFAULT_USERNAME = 'Anonymous';
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

  public images: string[];

  public taggables: String[];
  
  constructor(
    public dataService: DataService,
    private dialog : MatDialog,
    public dialogRef : MatDialogRef<AddPostComponent>,
  ) { }

  ngOnInit(): void {
    // this.dataService.setTitle("Create post")
    this.populateDummyData();
    
    let user = this.dataService.getCurrentUser();
    if(user !== undefined) this.profilePic = user.profile_pic;
  }

  populateDummyData(): void{
    this.taggables = new Array<String>();

    this.taggables.push("ISHA");
    this.taggables.push("GSCA");
    this.taggables.push("EESA");
    this.taggables.push("DevCom");

    this.images = new Array<string>();
    this.images.push("https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FydG9vbnN8ZW58MHx8MHx8&w=1000&q=80");
    this.images.push("https://rukminim1.flixcart.com/image/416/416/k3hmj680/poster/t/9/p/medium-shinchan-cartoon-poster-self-adhesive-poster-wall-original-imaffg8yhsvuqgyz.jpeg?q=70");
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
