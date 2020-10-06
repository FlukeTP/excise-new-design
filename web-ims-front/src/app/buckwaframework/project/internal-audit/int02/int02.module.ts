import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { PipeModule } from "app/buckwaframework/common/pipes/pipe.module";
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { BreadcrumbModule, ButtonModule, ModalModule, PaginationModule, SegmentModule } from "../../../common/components";
import { CanDeactivateGuard } from "../../../common/services";
import { Int02M31Component } from "./int02-m3/int02-m3-1/int02-m3-1.component";
import { Int02M3Component } from "./int02-m3/int02-m3.component";
import { Int02M41Component } from "./int02-m4/int02-m4-1/int02-m4-1.component";
import { Int02M42Component } from "./int02-m4/int02-m4-2/int02-m4-2.component";
import { Int02M43Component } from "./int02-m4/int02-m4-3/int02-m4-3.component";
import { Int02M4Component } from "./int02-m4/int02-m4.component";
import { Int02M511Component } from "./int02-m5/int02-m5-1/int02-m5-1-1/int02-m5-1-1.component";
import { Int02M512Component } from './int02-m5/int02-m5-1/int02-m5-1-2/int02-m5-1-2.component';
import { Int02M513Component } from './int02-m5/int02-m5-1/int02-m5-1-3/int02-m5-1-3.component';
import { Int02M51Component } from "./int02-m5/int02-m5-1/int02-m5-1.component";
import { Int02M521Component } from "./int02-m5/int02-m5-2/int02-m5-2-1/int02-m5-2-1.component";
import { Int02M52Component } from "./int02-m5/int02-m5-2/int02-m5-2.component";
import { Int02Component } from './int02.component';
import { Int02Service } from "./int02.service";
import { Int0201Component } from "./int0201/int0201.component";
import { Int020101Component } from './int0201/int020101/int020101.component';
import { Int02010101Component } from './int0201/int020101/int02010101/int02010101.component';
import { Int020102Component } from './int0201/int020102/int020102.component';
import { Int0203Component } from './int0203/int0203.component';
import { Int020301Component } from './int0203/int020301/int020301.component';

const routes: Routes = [
  { path: "", component: Int02Component },
  { path: "01", component: Int0201Component },
  { path: '02', loadChildren: './int0202/int0202.module#Int0202Module' },
  { path: "03", component: Int0203Component },
  { path: '04', loadChildren: './int0204/int0204.module#Int0204Module' },
  { path: "03/01", component: Int020301Component },
  {
    path: "01/01",
    component: Int020101Component,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "01/02",
    component: Int020102Component,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "01/01/01",
    component: Int02010101Component,
    canDeactivate: [CanDeactivateGuard]
  },
  // { path: "m3", component: Int02M3Component },
  // { path: "m3/1", component: Int02M31Component },
  { path: "m4", component: Int02M4Component },
  { path: "m5/1", component: Int02M51Component },
  { path: "m5/1/1", component: Int02M511Component },
  { path: "m5/1/2", component: Int02M512Component },
  { path: "m5/1/3", component: Int02M513Component },
  { path: "m5/2", component: Int02M52Component },
  { path: "m5/2/1", component: Int02M521Component }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Components Modules
    PaginationModule,
    BreadcrumbModule,
    ModalModule,
    // Pipe Modules
    PipeModule,
    SegmentModule,
    ButtonModule,
    SharedModule,
    DragDropModule,
  ],
  declarations: [
    // M Main Component
    Int0201Component,
    Int0203Component,
    Int02M3Component,
    Int02M4Component,
    // M Sub Component
    Int02M31Component,
    Int02M41Component,
    Int02M42Component,
    Int02M43Component,
    Int02M51Component,
    Int02M52Component,
    // M Sub 2 Component
    Int02M511Component,
    Int02M521Component,
    Int02M512Component,
    Int02M513Component,
    Int020101Component,
    Int020102Component,
    Int02010101Component,
    Int02Component,
    Int020301Component
  ],
  providers: [Int02Service],
  exports: [RouterModule]
})
export class Int02Module { }
