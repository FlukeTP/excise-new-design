import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { TableCustomModule } from '../table-custom/table-custom.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {path : "01", loadChildren:'./ta0501/ta0501.module#Ta0501Module'},

];

@NgModule({
  declarations: [],
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
export class Ta05Module { }
