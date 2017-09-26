import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class OpportunityService {

  constructor(private http: HttpClient) {
  }

}
