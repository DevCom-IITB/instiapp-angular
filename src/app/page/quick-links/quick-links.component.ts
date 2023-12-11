import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

interface LinkContainer {
  title: string;
  links: Link[];
}

interface Link {
  href: string;
  icon: string;
  text: string;
}

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.css']
})
export class QuickLinksComponent implements OnInit {

  public sections: LinkContainer[] = [
    {
      title: 'DevCom',
      links: [
        { href: 'https://www.devcom-iitb.org/', icon: 'book', text: 'DevCom Website' },
        { href: 'https://ams.iitb.ac.in', icon: 'book', text: 'AMS' },
      ],
    },
    {
      title: 'Academic',
      links: [
        { href: 'https://asc.iitb.ac.in', icon: 'book', text: 'ASC' },
        { href: 'https://portal.iitb.ac.in/asc', icon: 'book', text: 'ASC - External' },
        { href: 'https://moodle.iitb.ac.in', icon: 'book', text: 'Moodle' },
        { href: 'https://campus.placements.iitb.ac.in/auth/student/login', icon: 'school', text: 'Internship and Placement Login' },
        { href: 'http://www.library.iitb.ac.in/', icon: 'local_library', text: 'Central Library' },
      ],
    },
    {
      title: 'Calendar',
      links: [
        { href: 'http://www.iitb.ac.in/newacadhome/toacadcalender.jsp', icon: 'today', text: 'Academic Calendar' },
        { href: 'http://www.iitb.ac.in/newacadhome/timetable.jsp', icon: 'access_alarm', text: 'Academic Timetable' },
        { href: 'http://www.iitb.ac.in/en/about-iit-bombay/iit-bombay-holidays-list', icon: 'whatshot', text: 'Holidays List' },
        { href: 'http://www.iitb.ac.in/newacadhome/circular.jsp', icon: 'info', text: 'Circulars' },
        { href: 'https://portal.iitb.ac.in/asc/Courses', icon: 'school', text: 'Course List' },
      ],
    },
    {
      title: 'Services',
      links: [
        { href: 'https://sso.iitb.ac.in/', icon: 'account_box', text: 'SSO Login' },
        { href: 'https://webmail.iitb.ac.in', icon: 'email', text: 'WebMail' },
        { href: 'https://camp.iitb.ac.in/', icon: 'account_box', text: 'CAMP' },
        { href: 'https://home.iitb.ac.in/', icon: 'cloud', text: 'BigHome Cloud' },
        { href: 'ftp://ftp.iitb.ac.in/', icon: 'folder_open', text: 'FTP Server' },
      ],
    },
    {
      title: 'Miscellaneous',
      links: [
        { href: 'https://access.iitb.ac.in/', icon: 'phone', text: 'CC Access Portal' },
        { href: 'https://portal.iitb.ac.in/TelephoneDirectory/', icon: 'phone', text: 'Intercom Extensions' },
        { href: 'http://www.iitb.ac.in/hospital/', icon: 'local_hospital', text: 'Hospital' },
        { href: 'https://www.cc.iitb.ac.in/page/configurevpn', icon: 'vpn_lock', text: 'VPN Guide' },
        { href: 'https://www.iitb-bandhu.com/', icon: 'emoji_people', text: 'Bandhu IITB' },
      ]
    }
  ];

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.setTitle('Quick Links');
  }

}
