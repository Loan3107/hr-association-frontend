import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { SharedModule } from 'src/shared/shared.module';
import { EmployeesFormComponent } from './employees-form/employees-form.component';



@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeesFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class EmployeesModule { }
