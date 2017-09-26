import { Component, OnInit } from '@angular/core';
import { OpportunityService } from './opportunity.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent implements OnInit {
  opportunityDetails: Object;
  prerequisitesDetails: Array<Object>;
  skills: Object;
  languages: Object;
  nationalities: Object;
  backgrounds: Object;
  study_levels: String;

  constructor(private http: HttpClient, private opportunityService: OpportunityService, private router: Router) { }

  ngOnInit() {
    this.getOpportunity();
  }

  getOpportunity() {
    const id = 526;
    // tslint:disable-next-line:max-line-length
    const url = 'http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/opportunities/' + id + '?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c&with_translations=true';

    this.http.get(url).subscribe(data => {
      console.log(data);
      this.opportunityDetails = data;
      this.setOpportunity();
      const image_url: String = this.opportunityDetails['cover_photo_urls'];
      document.getElementById('background-image-dynamic')[0].style.backgroundImage = 'url(image_url)';

    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    });
  }
  setOpportunity() {
    console.log('inside setOpportunity');
    this.skills = {
      'REQUIRED': [],
      'PREFERRED': []
    };
    if(this.opportunityDetails['skills']){
      for (const skill of this.opportunityDetails['skills']) {
        if (skill['option'] === 'required') {
          this.skills['REQUIRED'].push(skill['name']);
        } else if (skill['option'] === 'preferred') {
          this.skills['PREFERRED'].push(skill['name']);
        }
      }
    }

    this.languages = {
      'REQUIRED': [],
      'PREFERRED': []
    };
    if(this.opportunityDetails['languages']){
      for (const language of this.opportunityDetails['languages']) {
        if (language['option'] === 'required') {
          this.languages['REQUIRED'].push(language['name']);
        } else if (language['option'] === 'preferred') {
          this.languages['PREFERRED'].push(language['name']);
        }
      }
    }

    this.nationalities = {
      'REQUIRED': [],
      'PREFERRED': []
    };
    if(this.opportunityDetails['nationalities']){
      for (const nationality of this.opportunityDetails['nationalities']) {
        if (nationality['option'] === 'required') {
          this.nationalities['REQUIRED'].push(nationality['name']);
        } else if (nationality['option'] === 'preferred') {
          this.nationalities['PREFERRED'].push(nationality['name']);
        }
      }
    }

    this.backgrounds = {
      'REQUIRED': [],
      'PREFERRED': []
    };
    if(this.opportunityDetails['backgrounds']){
      for (const background of this.opportunityDetails['backgrounds']) {
        if (background['option'] === 'required') {
          this.backgrounds['REQUIRED'].push(background['name']);
        } else if (background['option'] === 'preferred') {
          this.backgrounds['PREFERRED'].push(background['name']);
        }
      }
    }

    this.study_levels = '';
    for (const study_level of this.opportunityDetails['study_levels']) {
      this.study_levels += study_level['name'];
    }

    this.prerequisitesDetails = [{
      'Skills': {
        'REQUIRED': this.skills['REQUIRED'].toString(),
        'PREFERRED': this.skills['PREFERRED'].toString()
      }
    }, {
      'Languages': {
        'REQUIRED': this.languages['REQUIRED'].toString(),
        'PREFERRED': this.languages['PREFERRED'].toString()
      }
    }, {
      'Nationalities': {
        'REQUIRED': this.nationalities['REQUIRED'].toString(),
        'PREFERRED': this.nationalities['PREFERRED'].toString()
      }
    }, {
      'Backgrounds': {
        'REQUIRED': this.backgrounds['REQUIRED'].toString(),
        'PREFERRED': this.backgrounds['PREFERRED'].toString()
      }
    }
    ];
    console.log('****************');
    console.log(this.prerequisitesDetails);
  }

  getKey(data: Object): string {
    return Object.keys(data)[0];
  }

  getDate(date: string): string {
    return (new Date(date)).toLocaleDateString();
  }

  edit(event, elem) {
    console.log(event.target.className.search('fa-pencil-square-o'));
    if (event.target.className.search('fa-pencil-square-o') !== -1) {
      elem.contentEditable = 'true';
      elem.className += ' editable-elem';
      event.target.className = event.target.className.replace('fa-pencil-square-o', 'fa-floppy-o');
    } else if (event.target.className.search('fa-pencil-square-o') === -1) {
      elem.contentEditable = 'false';
      elem.className = elem.className.replace('editable-elem', '');
      event.target.className = event.target.className.replace('fa-floppy-o', 'fa-pencil-square-o');
    }
    console.log(this.opportunityDetails['description']);
  }
  editDetails(id) {
    const localOpp = {
      'title': this.opportunityDetails['title'],
      'applications_close_date': this.opportunityDetails['applications_close_date'],
      'earliest_start_date': this.opportunityDetails['earliest_start_date'],
      'latest_end_date': this.opportunityDetails['latest_end_date'],
      'description': this.opportunityDetails['description'],
      'backgrounds': this.opportunityDetails['backgrounds'],
      'skills': this.opportunityDetails['skills'],
      'role_info': {
        'selection_process': this.opportunityDetails['role_info']['selection_process'],
        'city': this.opportunityDetails['role_info']['city']
      },
      'specifics_info': {
        'salary': this.opportunityDetails['specifics_info']['salary']
      }
    };
    localStorage.setItem('opportunityDetails', JSON.stringify(localOpp));
    this.router.navigate(['/opportunity/edit', id]);
  }
}
