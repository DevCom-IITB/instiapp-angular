import { Component, OnInit } from '@angular/core';
import { IComplaint, IComplaintTagUri, IComplaintPost } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../data.service';
import { API } from '../../../api';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { VenterDataService } from '../venter-data.service';

const PLACEHOLDER = 'assets/placeholder_image.svg';
const currentLat = 19.1310;
const currentLong = 72.9077;

@Component({
  selector: 'app-file-complaint',
  templateUrl: './file-complaint.component.html',
  styleUrls: ['./file-complaint.component.css']
})
export class FileComplaintComponent implements OnInit {

  public networkBusy = false;

  tagCategories: IComplaintTagUri[];
  option: string[];

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  public complaint: IComplaintPost;
  public image: string;
  public tag: string;
  public selectedTags: string[] = [];
  public selectedindex = 0;

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public venterDataService: VenterDataService,
  ) { }

  ngOnInit() {
    this.tagCategories = [];
    this.complaint = {} as IComplaintPost;
    this.option = [];
    this.complaint.latitude = currentLat;
    this.complaint.longitude = currentLong;
    this.complaint.images = [];
    this.complaint.location_description = 'IIT Area';

  this.dataService.setTitle('Complaints & Suggestions');
  /* Get all the tags from server*/
  this.dataService.FireGET<IComplaintTagUri[]>(API.TagCategories).subscribe(result => {
    this.tagCategories = result;
    this.tagCategories.forEach(element => {
      this.option.push(element.tag_uri);
    });
  });
  this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.option.filter(option => option.toLowerCase().includes(filterValue));
  }

  MarkNetworkBusy(): Boolean {
    if (this.networkBusy) { return false; }
    this.networkBusy = true;
    return true;
  }

  selectImage(index: number) {
    this.selectedindex = index;
  }

  uploadImage(files: FileList) {
    if (!this.MarkNetworkBusy()) { return; }
    this.dataService.UploadImage(files[0]).subscribe(result => {
      this.image = result.picture;
      this.complaint.images.push(this.image);
      this.networkBusy = false;
      this.venterDataService.getSnackbar('Image Uploaded', null);
    }, (error) => {
      this.networkBusy = false;
      this.venterDataService.getSnackbar('Upload Failed', error);
    });
  }

  /**
   * Gets the image URL or placeholder
   */
  getImageUrl() {
    if (this.complaint && this.image) {
      return this.image;
    } else {
      return PLACEHOLDER;
    }
  }

  addTag() {
    this.selectedTags.push(this.tag);
    this.tag = '';
  }

  clearTag(deleteTag: string) {
    for (let i = 0; i < this.selectedTags.length; i++) {
      if (this.selectedTags[i] === deleteTag) {
        this.selectedTags.splice(i, 1);
      }
    }
  }

  submitComplaint() {
    this.complaint.tags = this.selectedTags;
    if (this.complaint.description === '') {
      this.venterDataService.getSnackbar('Please enter a description before submitting the complaint!', null);
    } else {
    this.dataService.FirePOST<IComplaint>(API.Complaints, this.complaint).subscribe(() => {});
    }
  }
}
