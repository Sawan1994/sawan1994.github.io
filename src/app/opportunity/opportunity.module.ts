import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { OpportunityComponent } from './opportunity.component';
import { OpportunityService } from './opportunity.service';
import { HttpClientModule } from '@angular/common/http';
import { OpportunityRoutingModule } from './opportunity-routing.module';
import { OpportunityEditComponent } from './opportunity-edit.component';

@NgModule({
  imports: [BrowserModule, HttpClientModule, FormsModule, OpportunityRoutingModule],
  declarations: [OpportunityComponent, OpportunityEditComponent],
  providers: [OpportunityService]
})
export class OpportunityModule {

}
