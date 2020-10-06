import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  // { path: '', redirectTo: '01', pathMatch: 'full' },
  { path: "01", loadChildren:'./ta1001/ta1001.module#Ta1001Module' },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,    
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule
  ]
})
export class Ta10Module { }
