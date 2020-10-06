import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Ta020202Component } from './ta020202.component';
import { Ta02020201Component } from './ta02020201/ta02020201.component';
import { Ta02020202Component } from './ta02020202/ta02020202.component';
import { Ta02020203Component } from './ta02020203/ta02020203.component';
import { Ta02020204Component } from './ta02020204/ta02020204.component';
import { Ta02020205Component } from './ta02020205/ta02020205.component';
import { Ta02020206Component } from './ta02020206/ta02020206.component';
import { Ta02020207Component } from './ta02020207/ta02020207.component';
import { Ta02020208Component } from './ta02020208/ta02020208.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './ta020202.reducers';

const routes: Routes = [
  { path: '', redirectTo: "01", pathMatch: "full" },
  {
    path: '', component: Ta020202Component,
    children: [
      { path: '01', component: Ta02020201Component },
      { path: '02', component: Ta02020202Component },
      { path: '03', component: Ta02020203Component },
      { path: '04', component: Ta02020204Component },
      { path: '05', component: Ta02020205Component },
      { path: '06', component: Ta02020206Component },
      { path: '07', component: Ta02020207Component },
      { path: '08', component: Ta02020208Component },
    ]
  },
]

@NgModule({
  declarations: [
    Ta020202Component,
    Ta02020201Component,
    Ta02020202Component,
    Ta02020203Component,
    Ta02020204Component,
    Ta02020205Component,
    Ta02020206Component,
    Ta02020207Component,
    Ta02020208Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    StoreModule.forFeature('Ta020202', reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states      
    }),
  ],
  exports: [
    RouterModule
  ]
})
export class Ta020202Module { }
