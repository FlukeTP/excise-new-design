import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormSearchModule } from '../form-search/form-search.module';
import { Ta020207Component } from './ta020207.component';
import { Ta02020701Component } from './ta02020701/ta02020701.component';
import { Ta02020702Component } from './ta02020702/ta02020702.component';
import { Ta02020703Component } from './ta02020703/ta02020703.component';
import { Ta02020704Component } from './ta02020704/ta02020704.component';
import { Ta02020705Component } from './ta02020705/ta02020705.component';
import { Ta02020706Component } from './ta02020706/ta02020706.component';
import { Ta02020707Component } from './ta02020707/ta02020707.component';
import { Ta02020708Component } from './ta02020708/ta02020708.component';
import { Ta02020709Component } from './ta02020709/ta02020709.component';
import { Ta02020710Component } from './ta02020710/ta02020710.component';
import { Ta02020711Component } from './ta02020711/ta02020711.component';

const routes: Routes = [
  { path: '', redirectTo: "01", pathMatch: "full" },
  {
    path: '', component: Ta020207Component,
    children: [
      { path: '01', component: Ta02020701Component },
      { path: '02', component: Ta02020702Component },
      { path: '03', component: Ta02020703Component },
      { path: '04', component: Ta02020704Component },
      { path: '05', component: Ta02020705Component },
      { path: '06', component: Ta02020706Component },
      { path: '07', component: Ta02020707Component },
      { path: '08', component: Ta02020708Component },
      { path: '09', component: Ta02020709Component },
      { path: '10', component: Ta02020710Component },
      { path: '11', component: Ta02020711Component },
    ]
  },
];

@NgModule({
  declarations: [
    Ta020207Component,
    Ta02020701Component,
    Ta02020702Component,
    Ta02020703Component,
    Ta02020704Component,
    Ta02020705Component,
    Ta02020706Component,
    Ta02020707Component,
    Ta02020708Component,
    Ta02020709Component,
    Ta02020710Component,
    Ta02020711Component,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormSearchModule
  ],
  exports: [
    RouterModule
  ]
})
export class Ta020207Module { }
