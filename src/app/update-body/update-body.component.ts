import { Component, OnInit } from '@angular/core';
import { IBody } from '../interfaces';
import { DataService } from '../data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { API } from '../../api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-body',
  templateUrl: './update-body.component.html',
  styleUrls: ['./update-body.component.css']
})
export class UpdateBodyComponent implements OnInit {

  body: IBody;
  bodyId: string;

  constructor(
    public dataService: DataService,
    public activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    if (!this.dataService.isLoggedIn()) {
      alert('Please login to continue!');
      this.dataService.navigateBack();
      return;
    }

    this.activatedRoute.params.subscribe((params: Params) => {
      this.bodyId = params['id'];
      this.refresh();
    });
  }

  /** Loads the data */
  refresh() {
    this.dataService.FireGET<IBody>(API.Body, {uuid: this.bodyId}).subscribe(result => {
      this.body = result;
      this.dataService.setTitle(result.name);
    });
  }

  /** Upload image to API and set image url */
  uploadImage(files: FileList) {
    this.dataService.UploadImage(files[0]).subscribe(result => {
      this.body.image_url = result.picture;
      this.snackBar.open('Image Uploaded', 'Dismiss', {
        duration: 2000,
      });
    }, () => {
      this.snackBar.open('Image Uploading Failed', 'Dismiss', {
        duration: 2000,
      });
    });
  }

  /** Make a PUT request */
  go() {
    this.dataService.FirePUT(API.Body, this.body, {uuid: this.bodyId}).subscribe(result => {
      this.snackBar.open('Successful!', 'Dismiss', {
        duration: 2000,
      });
    });
  }

}
