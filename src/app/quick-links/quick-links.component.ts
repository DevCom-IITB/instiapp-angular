import { Component, OnInit } from '@angular/core';

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
      title: 'CMS',
      links: [
        { href: 'https://gymkhana.iitb.ac.in/cms_new/', icon: 'warning', text: 'CMS' },
        { href: 'https://support.iitb.ac.in', icon: 'warning', text: 'CMS - Maintainance' },
        { href: 'https://help-cc.iitb.ac.in/', icon: 'warning', text: 'CMS - Network' },
      ],
    },
    {
      title: 'Academic',
      links: [
        { href: 'https://asc.iitb.ac.in', icon: 'book', text: 'ASC' },
        { href: 'https://portal.iitb.ac.in/asc', icon: 'book', text: 'ASC - External' },
        { href: 'https://moodle.iitb.ac.in', icon: 'book', text: 'Moodle' },
        { href: 'http://placements.iitb.ac.in/internship/login.jsp', icon: 'school', text: 'Internship Login' },
        { href: 'http://placements.iitb.ac.in/placements/login.jsp', icon: 'school', text: 'Placement Login' },
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
        { href: 'https://gpo.iitb.ac.in', icon: 'email', text: 'GPO' },
        { href: 'https://camp.iitb.ac.in/', icon: 'account_box', text: 'CAMP' },
        { href: 'http://msstore.iitb.ac.in/', icon: 'shopping_cart', text: 'Microsoft Store' },
        { href: 'https://home.iitb.ac.in/', icon: 'cloud', text: 'BigHome Cloud' },
        { href: 'ftp://ftp.iitb.ac.in/', icon: 'folder_open', text: 'FTP Server' },
      ],
    },
    {
      title: 'Misc',
      links: [
        { href: 'https://portal.iitb.ac.in/TelephoneDirectory/', icon: 'phone', text: 'Intercom Extensions' },
        { href: 'http://www.iitb.ac.in/hospital/', icon: 'local_hospital', text: 'Hospital' },
        { href: 'https://www.cc.iitb.ac.in/engservices/engaccessingiitffromoutside/19-vpn', icon: 'vpn_lock', text: 'VPN Guide' },
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
