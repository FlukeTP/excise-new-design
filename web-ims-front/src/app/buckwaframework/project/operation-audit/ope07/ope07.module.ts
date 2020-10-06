import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ope07Component } from './ope07.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './ope07.reducers';

const routes: Routes = [
  { path: '', component: Ope07Component },
  //{ path: '1', loadChildren: './ope0701/ope0701.module#Ope0701Module' },
  {
    path: '', component: Ope07Component,
    children: [
      { path: "1", loadChildren: './ope0701/ope0701.module#Ope0701Module' },
      { path: "2", loadChildren: './ope0702/ope0702.module#Ope0702Module' },
      { path: "3", loadChildren: './ope0703/ope0703.module#Ope0703Module' },
    ]
  },
]
@NgModule({
  declarations: [Ope07Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    StoreModule.forFeature('ope07', reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states      
    }),
  ],
  exports: [RouterModule]
})
export class Ope07Module { }
