import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta020203Component } from './ta020203.component';
import { ButtonModule } from 'components/button/button.module';
import { RouterModule, Routes } from '@angular/router';
import { SegmentModule } from 'components/segment/segment.module';
import { AuthGuard } from 'services/auth-guard.service';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule  } from '@angular/forms';


const routes: Routes = [
  { path: "", component: Ta020203Component },
  {
    path: '', component: Ta020203Component,
    children: [
      { path: "01", loadChildren: './ta02020301/ta02020301.module#Ta02020301Module' },
      { path: "02", loadChildren: './ta02020302/ta02020302.module#Ta02020302Module' },
      { path: "03", loadChildren: './ta02020303/ta02020303.module#Ta02020303Module' },
    ]
  },
];
@NgModule({
  declarations: [Ta020203Component],
  imports: [
    CommonModule,
    SegmentModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule
  ],
  exports:[
    RouterModule
  ]
})
export class Ta020203Module { }
