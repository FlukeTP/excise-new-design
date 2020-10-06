import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { AddComponent } from './user-management/add/add.component';
import { RoleComponent } from './role/role.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OperationComponent } from './operation/operation.component';
import { AddOperationComponent } from './operation/add-operation/add-operation.component';
import { RoleAssignOperationComponent } from './role/role-assign-operation/role-assign-operation.component';
import { UserAssignRoleComponent } from './user-management/user-assign-role/user-assign-role.component';
import { PreferencesComponent } from './preferences/preferences.component';

const routes: Routes = [
  { path: "user-management", component: UserManagementComponent }, 
  { path: "user-add", component: AddComponent }, 
  { path: "role", component: RoleComponent }, 
  { path: "role-add", component: AddRoleComponent },
  { path: "role-assign-operation", component: RoleAssignOperationComponent },
  { path: "operation", component: OperationComponent }, 
  { path: "operation-add", component: AddOperationComponent }, 
  { path: "user-assign-role", component: UserAssignRoleComponent }, 
  { path: "ed", loadChildren: "projects/admin-management/ed/ed.module#EDModule" },
  { path: "preferences", component: PreferencesComponent }
  // ed-routing.module
];

@NgModule({
  declarations: [
    UserManagementComponent,
    AddComponent,
    RoleComponent,
    AddRoleComponent,
    RoleAssignOperationComponent,
    OperationComponent,
    AddOperationComponent,
    UserAssignRoleComponent,
    PreferencesComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    RouterModule
  ]
})
export class AdminManagementModule { }
