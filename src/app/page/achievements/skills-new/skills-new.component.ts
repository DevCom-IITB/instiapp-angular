import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../data.service';
import { IAchievement } from '../../../interfaces';
import { API } from '../../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-skills-new',
  templateUrl: './skills-new.component.html',
  styleUrls: ['./skills-new.component.css']
})
export class SkillsNewComponent implements OnInit, OnDestroy {

  /** Main object to edit */
  skill: IAchievement;


  resultMessage = '';

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    /* Set title on mobile */
    if (this.dataService.isMobile()) {
      this.dataService.setTitle('Skill Request');
    }

    this.skill = {} as IAchievement;







  }

  ngOnDestroy() {

  }







  /** Set skill from an autocomplete Skills */
  setSkill(event: any): void {
    if (event.option) {
      console.log(event.option.value.title)
      this.skill.title = event.option.value.title;
      this.skill.isSkill = true;
      this.skill.body = event.option.value.body;

      console.log(this.skill)
    }
  }



  /** Fire the request */
  go(): void {
    if (!confirm('Proceed with requesting verification?')) {
      return;
    }

    this.dataService.FirePOST<IAchievement>(API.Achievements, this.skill).subscribe(() => {
      this.snackBar.open('Your request has been recorded', 'Dismiss', { duration: 2000 });
      this.skill = {} as IAchievement;
      this.router.navigate(['/achievements']);
    }, err => {
      this.snackBar.open(`There was an error: ${err.message}`, 'Dismiss');
    });
  }

}
