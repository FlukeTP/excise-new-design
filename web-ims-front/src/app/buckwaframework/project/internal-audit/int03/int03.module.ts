import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int0305Component } from './int0305/int0305.component';

const routes: Routes = [
  { path: "01", loadChildren: "./int0301/int0301.module#Int0301Module" },
  { path: "04", loadChildren: './int0304/int0304.module#Int0304Module' },
  { path: "05", component: Int0305Component },
  { path: "06", loadChildren: './int0306/int0306.module#Int0306Module' },
  { path: "07", loadChildren: './int0307/int0307.module#Int0307Module' },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [Int0305Component],
  exports: [RouterModule]
})
export class Int03Module { }
