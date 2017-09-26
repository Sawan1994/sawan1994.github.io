import { Component, OnInit } from '@angular/core';
import { OpportunityService } from './opportunity.service';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Component({
  templateUrl: './opportunity-edit.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityEditComponent implements OnInit {
  opportunityDetails: Object;
  backgroundsList: Array<Object>;
  skillsList: Array<Object>;
  cities: Array<Object>;
  selectedBackgroundReq: string;
  selectedBackgroundPref: string;
  selectedSkillReq: string;
  selectedSkillPref: string;
  minDate;
  maxDate;
  flag = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private opportunityService: OpportunityService
  ) {
  }

  ngOnInit() {
    this.opportunityDetails = JSON.parse(localStorage.getItem('opportunityDetails'));
    // tslint:disable-next-line:max-line-length
    this.opportunityDetails['applications_close_date'] = new Date(this.opportunityDetails['applications_close_date']).toJSON().split('T')[0];
    this.opportunityDetails['latest_end_date'] = new Date(this.opportunityDetails['latest_end_date']).toJSON().split('T')[0];
    this.opportunityDetails['earliest_start_date'] = new Date(this.opportunityDetails['earliest_start_date']).toJSON().split('T')[0];
    this.setMinMaxDate();
    this.getBackgroundsList();
    this.getSkillsList();
  }

  setMinMaxDate() {
    let todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + 30);
    this.minDate = todayDate.toJSON().split('T')[0];
    todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + 90);
    this.maxDate = todayDate.toJSON().split('T')[0];
  }
  getBackgroundsList() {
    // tslint:disable-next-line:max-line-length
    const url = 'http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/lists/backgrounds?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c';
    this.http.get(url)
      .subscribe((data: Array<Object>) => {
        this.backgroundsList = data;
      });
  }

  getSkillsList() {
    // tslint:disable-next-line:max-line-length
    const url = 'http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/lists/skills?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c';
    this.http.get(url)
      .subscribe((data: Array<Object>) => {
        this.skillsList = data;
      });
  }

  getSelectedVal(option: string) {
    if (this.opportunityDetails['backgrounds'].length >= 3) {
      this.flag = true;
    } else {
      let backgroundArr;
      if (option === 'required') {
        backgroundArr = this.selectedBackgroundReq.split(':');
      } else if (option === 'preferred') {
        backgroundArr = this.selectedBackgroundPref.split(':');
      }

      const data = {
        'option': option,
        'id': backgroundArr[0],
        'name': backgroundArr[1]
      };
      this.opportunityDetails['backgrounds'].push(data);
      this.flag = false;
    }
  }

  getSelectedSkillVal(option: string) {
    let skillArr;
    if (option === 'required') {
      skillArr = this.selectedSkillReq.split(':');
    } else if (option === 'preferred') {
      skillArr = this.selectedSkillPref.split(':');
    }

    const data = {
      'option': option,
      'level': 0,
      'id': skillArr[0],
      'name': skillArr[1]
    };
    this.opportunityDetails['skills'].push(data);
  }

  updateOpportunity() {
    const url = 'http://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/opportunities/526';
    const params = {
      'access_token': 'dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c',
      'opportunity': this.opportunityDetails
    };
    this.http.patch(url, params).subscribe(data => {
      console.log('********PATCH RESPONSE********');
      console.log(data);
    });
  }

  deleteItem(index, option) {
    this.opportunityDetails[option].splice(index, 1);
  }

  fetchAddress(elem) {
    const parameters = {
      'query': this.opportunityDetails['role_info']['city'],
      'key': 'AIzaSyBeZzUtGcJcElgAGIG4LxYN29t0GxHkBP0'
    };
    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + parameters['query'] + '&key=' + parameters['key'];
    const options = {
      headers : new HttpHeaders().append('Access-Control-Allow-Origin', '*')
    };
    this.http.get(url, options).subscribe(data => {
      console.log('********GOOGLE******');
      console.log(data);
      this.cities = data['predictions'];
      console.log(this.cities);
      if (this.cities.length > 0) {
        elem.style.display = 'block';
        console.log('Inside block:' + elem.className);
      } else {
        elem.style.display = 'none';
      }
    });
  }

  showDropdown(elem, city) {
    this.opportunityDetails['role_info']['city'] = city;
    elem.style.display = 'none';
  }
}
