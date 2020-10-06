import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0301Component } from './ta0301.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './ta0301.reducers';
import { ButtonFooterReportModule } from '../button-footer-report/button-footer-report.module';
import { Ta0301Service } from './ts0301.service';


const routes: Routes = [
  { path: "", component: Ta0301Component },
  {
    path: '', component: Ta0301Component,
    children: [
      { path: "ta-form-ts0101", loadChildren: './ta030101/ta030101.module#Ta030101Module' },
      { path: "ta-form-ts0102", loadChildren: './ta030102/ta030102.module#Ta030102Module' },
      { path: "ta-form-ts0103", loadChildren: './ta030103/ta030103.module#Ta030103Module' },
      { path: "ta-form-ts0104", loadChildren: './ta030104/ta030104.module#Ta030104Module' },
      { path: "ta-form-ts0105", loadChildren: './ta030105/ta030105.module#Ta030105Module' },
      { path: "ta-form-ts0106", loadChildren: './ta030106/ta030106.module#Ta030106Module' },
      { path: "ta-form-ts0107", loadChildren: './ta030107/ta030107.module#Ta030107Module' },
      { path: "ta-form-ts0108", loadChildren: './ta030108/ta030108.module#Ta030108Module' },
      { path: "ta-form-ts0109", loadChildren: './ta030109/ta030109.module#Ta030109Module' },
      { path: "ta-form-ts0110", loadChildren: './ta030110/ta030110.module#Ta030110Module' },
      { path: "ta-form-ts01101", loadChildren: './ta03011001/ta03011001.module#Ta03011001Module' },
      { path: "ta-form-ts0111", loadChildren: './ta030111/ta030111.module#Ta030111Module' },
      { path: "ta-form-ts0112", loadChildren: './ta030112/ta030112.module#Ta030112Module' },
      { path: "ta-form-ts0113", loadChildren: './ta030113/ta030113.module#Ta030113Module' },
      { path: "ta-form-ts0114", loadChildren: './ta030114/ta030114.module#Ta030114Module' },
      { path: "ta-form-ts01142", loadChildren: './ta030117/ta030117.module#Ta030117Module' },
      { path: "ta-form-ts0115", loadChildren: './ta030115/ta030115.module#Ta030115Module' },
      { path: "ta-form-ts0116", loadChildren: './ta030116/ta030116.module#Ta030116Module' },
      { path: "ta-form-ts01171", loadChildren: './ta03011701/ta03011701.module#Ta03011701Module' },
      { path: "ta-form-ts0117", loadChildren: './ta030117/ta030117.module#Ta030117Module' },
      { path: "ta-form-ts0118", loadChildren: './ta030118/ta030118.module#Ta030118Module' },
      { path: "ta-form-ts0119", loadChildren: './ta030119/ta030119.module#Ta030119Module' },
      { path: "ta-form-ts0120", loadChildren: './ta030120/ta030120.module#Ta030120Module' },
      { path: "ta-form-ts0121", loadChildren: './ta030121/ta030121.module#Ta030121Module' },
      { path: "ta-form-ts0302", loadChildren: './ta030302/ta030302.module#Ta030302Module' },
      { path: "ta-form-ts0303", loadChildren: './ta030303/ta030303.module#Ta030303Module' },
      { path: "ta-form-ts0423", loadChildren: './ta030423/ta030423.module#Ta030423Module' },
      { path: "ta-form-ts0424", loadChildren: './ta030424/ta030424.module#Ta030424Module' },
    ]
  },
];

@NgModule({
  declarations: [Ta0301Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule   
  ],
  exports: [RouterModule],
  providers: [Ta0301Service]
})
export class Ta0301Module { }
