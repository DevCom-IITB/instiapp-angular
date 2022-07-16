import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { ICommunityPost, IBody, IInterest, IUserProfile } from '../../../interfaces';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig, } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClosePopupComponent } from './close-popup/close-popup.component';
import { API } from '../../../../api';
import { ILocation } from 'instimapweb';

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
  public networkBusy = false;

  public images: string[];
  public searchQ: string;
  public users: IUserProfile[];
  
  addpost: ICommunityPost;
  @Input() taggables: String[];
  @Input() bodies = [] as IBody[];
  @Input() interests = [] as IInterest[];
  @Input() location: ILocation;

  
  constructor(
    public dataService: DataService,
    private dialog : MatDialog,
    public dialogRef : MatDialogRef<AddPostComponent>,
    public changeDetectorRef: ChangeDetectorRef,
    public snackBar: MatSnackBar,

    
  ) { }

  ngOnInit(): void {
    // this.dataService.setTitle("Create post")
    this.populateDummyData();
    this.getUser();
    
    let user = this.dataService.getCurrentUser();
    if(user !== undefined) this.profilePic = user.profile_pic;


  }

  getUser() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.userName = user.name;
      this.ldap = user.roll_no;
      this.profilePic = user.profile_pic;
    });
  }

  populateDummyData(): void{
    this.taggables = new Array<String>();

    this.taggables.push("ISHA");
    this.taggables.push("GSCA");
    this.taggables.push("EESA");
    this.taggables.push("DevCom");

    this.images = new Array<string>();
    if(this.addpost.image_url !==null){
      this.images.push("this.addpost.image_url")
    }
  }

  search(query: string,) {

    this.dataService.FireGET<any>(API.Search, {query: query}).subscribe(result => {
      /* Check if the search query changed in the meanwhile */
      if (this.searchQ !== query) { return; }

      /* Update all data */
      this.bodies = result.bodies;
      this.users = result.users;
    });
  }


  /** Get bodies after filter */
  getBodies() {
   { return this.bodies; }
  }

  /** Get people after filter */
  getPeople() {
   { return this.users; }
  }

   /** Tries to mark the network as busy */
   MarkNetworkBusy(): Boolean {
    if (this.networkBusy) { return false; }
    this.networkBusy = true;
    return true;
  }

  getImageUrl() {
    if (this.addpost && this.addpost.image_url && this.addpost.image_url !== '') {
      return this.addpost.image_url;
    } 
  }


  uploadImage(files: FileList) {
    if (!this.MarkNetworkBusy()) { return; }

    this.dataService.UploadImage(files[0]).subscribe(result => {
      this.addpost.image_url = result.picture;
      this.networkBusy = false;

    }, (error) => {
      this.networkBusy = false;
      this.snackBar.open(`Upload Failed - ${error.message}`, 'Dismiss', {
        duration: 2000,
      });
    });
  }




  onPost(){
    this.dataService.FirePOST<ICommunityPost>(API.CommunityAddPost, this.addpost).subscribe(() => {
    this.addpost = {} as ICommunityPost;
    });

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
