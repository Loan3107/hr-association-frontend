import { Component, OnInit, ViewChild } from '@angular/core';
import { isNil } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Employees } from 'src/shared/entities/employees.entity';
import { EmployeeService } from 'src/shared/services/employee.service';
import { EmployeesFormComponent } from './employees-form/employees-form.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  @ViewChild('employeesForm')
  public form!: EmployeesFormComponent;

  public employeeToHandle$ = new BehaviorSubject<Employees | undefined>(undefined);

  public employees$ = new BehaviorSubject<Employees[]>([] as Employees[]);
  private apiSubscription!: Subscription;
  
  constructor(private readonly employeesService: EmployeeService) { }

  public ngOnInit(): void {
    this.apiSubscription = this.employeesService.getEmployees().subscribe(
      (data: Employees[]) => {
        this.refreshEmployees(data);
      },
      (error) => {
        throw new Error(error);
      },
      () => {
        this.apiSubscription.unsubscribe();
      }
    );
  }

  public deleteEmployee(id: number): void {
    this.apiSubscription = this.employeesService.delete(id).subscribe({
      next: () => {
        const employees = this.employees$.getValue();
        const employeeToDelete = employees.find(x => x.id === id);
        if (!isNil(employeeToDelete)) employees.splice(employees.indexOf(employeeToDelete), 1);
         this.employees$.next(employees);
      },
      complete: () => {
        this.apiSubscription.unsubscribe();
      }
    })
  }

  public onAdd(): void {
    this.employeeToHandle$.next(undefined);
  }

  public onClose(): void {
    this.form.employeesForm.reset();
  }

  public onUpdate(employee: Employees): void {
    this.employeeToHandle$.next(employee);
  }

  public saveEmployee(employee: Employees): void {
    const employees = this.employees$.getValue();
    const employeeToHandle = employees.find(x => x.id === employee.id);
    
    if (!isNil(employeeToHandle)) employees.splice(employees.indexOf(employeeToHandle), 1, employee);
    else employees.push(employee);

    this.form.employeesForm.reset();
    this.employeeToHandle$.next(undefined);
    this.employees$.next(employees);
  }

  private refreshEmployees(data:Employees[]): void {
    this.employees$.next(data);
  }
}
