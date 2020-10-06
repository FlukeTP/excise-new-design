import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Ta0202Component } from './ta0202/ta0202.component';
import { Ta0201Component } from './ta0201/ta0201.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './ta02.reducers';
import { Ta020101Component } from './ta0201/ta020101/ta020101.component';

const routes: Routes = [
  { path: "01", loadChildren: './ta0201/ta0201.module#Ta0201Module' },
  { path: "02", loadChildren: './ta0202/ta0202.module#Ta0202Module' },
  { path: "03", loadChildren: './ta0203/ta0203.module#Ta0203Module' },
  { path: "04", loadChildren: './ta0204/ta0204.module#Ta0204Module' },
  { path: "02/se02", loadChildren: './ta0202/se02/se02.module#Se02Module' },
  { path: "05", loadChildren: './ta0205/ta0205.module#Ta0205Module' },
  { path: "06", loadChildren: './ta0206/ta0206.module#Ta0206Module' },
  { path: "07", loadChildren: './ta0207/ta0207.module#Ta0207Module' },
];
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    StoreModule.forFeature('Ta02', reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states      
    }),
  ],
  exports: [
    RouterModule
  ]

})
export class Ta02Module { }
