import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope0413Component } from './ope0413.component';
import { Ope041301Component } from './ope041301/ope041301.component';

const routes: Routes = [
  { path: '', component: Ope0413Component },
  { path: '01', component: Ope041301Component },
];

@NgModule({
  declarations: [Ope0413Component, Ope041301Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Ope0413Module { }
