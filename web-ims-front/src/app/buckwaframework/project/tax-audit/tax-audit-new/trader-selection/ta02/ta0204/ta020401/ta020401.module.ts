import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta020401Component } from './ta020401.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes = [
  { path: '', component: Ta020401Component }
]
@NgModule({
  declarations: [Ta020401Component],
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
export class Ta020401Module { }
