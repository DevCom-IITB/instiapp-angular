import { Component, OnInit } from '@angular/core';
import { IDPost } from '../../interfaces';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {
  @Input() post: IDPost;
   constructor(
    public dataService: DataService,) { 
    
  }

  ngOnInit(): void {
  }

}
