import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { Ta0104Component } from './ta0104.component';
import { TableCustomModule } from '../../table-custom/table-custom.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Ta010401Component } from './ta010401/ta010401.component';

const routes: Routes = [

  { path: "", component: Ta0104Component },  
  { path: "01", component: Ta010401Component },  
];


@NgModule({
  declarations: [
    Ta0104Component,
    Ta010401Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TableCustomModule,
    ReactiveFormsModule
  ],
  exports:[
    RouterModule
  ]
})
export class Ta0104Module { }
