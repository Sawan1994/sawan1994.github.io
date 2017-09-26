import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpportunityComponent } from './opportunity.component';
import { OpportunityEditComponent } from './opportunity-edit.component';

const opportunityRoutes: Routes = [
  {
    path: 'opportunity',
    component: OpportunityComponent
  },
  {
    path: 'opportunity/edit/:id',
    component: OpportunityEditComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(opportunityRoutes)
  ],
  exports: [RouterModule]
})
export class OpportunityRoutingModule { }
