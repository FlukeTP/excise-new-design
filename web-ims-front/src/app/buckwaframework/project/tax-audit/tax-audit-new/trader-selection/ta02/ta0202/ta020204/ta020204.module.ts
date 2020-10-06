import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta020204Component } from './ta020204.component';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ReactiveFormsModule  } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta020204Component },
  {
    path: '', component: Ta020204Component,
    children: [
      { path: "01", loadChildren: './ta02020401/ta02020401.module#Ta02020401Module' },
      { path: "02", loadChildren: './ta02020402/ta02020402.module#Ta02020402Module' },
      { path: "03", loadChildren: './ta02020403/ta02020403.module#Ta02020403Module' },
    ]
  },
];

@NgModule({
  declarations: [Ta020204Component],
  imports: [
    CommonModule,
    SegmentModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  exports:[
    RouterModule
  ]
})
export class Ta020204Module { }
