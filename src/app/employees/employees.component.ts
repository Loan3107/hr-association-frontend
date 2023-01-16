import { Component, OnInit } from '@angular/core';
import { isNil } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Employees } from 'src/shared/entities/employees.entity';
import { EmployeeService } from 'src/shared/services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
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

  public addValue(): void {
    this.employees$.next([
        {
          id: 1,
          firstName: "Loan",
          lastName: "PIROTAIS",
          mail: "loan.pirotais@cgi.com",
          password: "toto"
        },
        {
          id: 2,
          firstName: "Marion",
          lastName: "CADIEU",
          mail: "marioncadieu15@gmail.com",
          password: "toto"
        },
    ]);
  }

  public deleteValue(id: number): void {
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

  private refreshEmployees(data:Employees[]): void {
    this.employees$.next(data);
  }
}
