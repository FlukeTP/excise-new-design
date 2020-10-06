import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope02RoutingModule } from './ope02-routing.module';
import { Ope02Component } from './ope02.component';
import { Ope0202Component } from './ope0202/ope0202.component';
import { Ope0203Component } from './ope0203/ope0203.component';
import { Ope0204Component } from './ope0204/ope0204.component';
import { Ope0205Component } from './ope0205/ope0205.component';
import { Ope0206Component } from './ope0206/ope0206.component';
import { Ope0207Component } from './ope0207/ope0207.component';
import { Ope020701Component } from './ope0207/ope020701/ope020701.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './ope02.reducers';

@NgModule({
  declarations: [
    Ope02Component,
    Ope0202Component,
    Ope0203Component,
    Ope0204Component,
    Ope0205Component,
    Ope0206Component,
    Ope0207Component,
    Ope020701Component,
  ],
  imports: [
    CommonModule,
    Ope02RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature('Ope02', reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states      
    }),
  ]
})
export class Ope02Module { }
