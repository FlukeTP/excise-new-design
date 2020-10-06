import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EDRoutingModule } from './ed-routing.module';
import { Ed01Component } from './ed01/ed01.component';
import { Ed0101Component } from './ed01/ed0101/ed0101.component';
import { Ed0102Component } from './ed01/ed0102/ed0102.component';
import { Ed02Component } from './ed02/ed02.component';
import { Ed0201Component } from './ed02/ed0201/ed0201.component';
import { Ed03Component } from './ed03/ed03.component';
import { Ed04Component } from './ed04/ed04.component';



@NgModule({
  declarations: [Ed01Component, Ed0101Component, Ed02Component, Ed0201Component, Ed03Component, Ed0102Component, Ed04Component],
  imports: [
    CommonModule,
    EDRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class EDModule { }
