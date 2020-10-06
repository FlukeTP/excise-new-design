import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0204Component } from './ta0204.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes = [
  { path: '', component: Ta0204Component },
  { path: '01', loadChildren: './ta020401/ta020401.module#Ta020401Module' },
]
@NgModule({
  declarations: [Ta0204Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule
  ]
})
export class Ta0204Module { }
