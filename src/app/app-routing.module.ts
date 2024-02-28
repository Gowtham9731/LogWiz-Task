import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegisterComponent } from './User/user-register/user-register.component';
import { UserReportComponent } from './User/user-report/user-report.component';

const routes: Routes = [
  {path:'userRegister', component:UserRegisterComponent},
  {path:'userReport', component:UserReportComponent},
  {path:'userReport-edit/:id', component:UserRegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
