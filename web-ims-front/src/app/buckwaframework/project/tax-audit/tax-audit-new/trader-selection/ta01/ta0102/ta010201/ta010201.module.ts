import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes  } from '@angular/router';
import { Ta010201Component } from './ta010201.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TableCustomModule } from '../../../table-custom/table-custom.module';

const routes: Routes = [
  { path: "", component: Ta010201Component },
];
@NgModule({
  declarations: [
    Ta010201Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    TableCustomModule,
    HttpClientModule,
    ReactiveFormsModule  
  ],
  exports: [
    RouterModule
  ]

})
export class Ta010201Module { }
