import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0205Component } from './ta0205.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes = [
  { path: '', component: Ta0205Component },
  { path: "01", loadChildren: './ta020501/ta020501.module#Ta020501Module' },
]

@NgModule({
  declarations: [Ta0205Component],
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
export class Ta0205Module { }
