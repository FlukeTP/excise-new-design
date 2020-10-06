import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0106Component } from './ta0106/ta0106.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableCustomModule } from '../table-custom/table-custom.module';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
    {path : "01", loadChildren:'./ta0101/ta0101.module#Ta0101Module'},
    {path : "02", loadChildren:'./ta0102/ta0102.module#Ta0102Module'},
    {path : "03", loadChildren:'./ta0103/ta0103.module#Ta0103Module'},
    {path : "04", loadChildren:'./ta0104/ta0104.module#Ta0104Module'},
    {path : "05", loadChildren:'./ta0105/ta0105.module#Ta0105Module'},
    {path : "06", component: Ta0106Component},
    {path : "07", loadChildren:'./ta0107/ta0107.module#Ta0107Module'},
    {path : "08", loadChildren:'./ta0108/ta0108.module#Ta0108Module'},
    {path : "09", loadChildren:'./ta0109/ta0109.module#Ta0109Module'},
    {path : "10", loadChildren:'./ta0110/ta0110.module#Ta0110Module'},
    {path : "11", loadChildren:'./ta0111/ta0111.module#Ta0111Module'},
  ];

  @NgModule({
    declarations: [
      Ta0106Component,
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      SharedModule,
      TableCustomModule,
      ReactiveFormsModule
    ],
    exports: [
      RouterModule
    ]
  })
  export class Ta01Module { }
