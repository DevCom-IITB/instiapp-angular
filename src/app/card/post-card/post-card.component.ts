import { Component, OnInit, Input } from '@angular/core';
import { IPost } from '../../interfaces';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {
  @Input() post: IPost;
   constructor(
    public dataService: DataService,) { 
    
  }

  ngOnInit(): void {
  }

}