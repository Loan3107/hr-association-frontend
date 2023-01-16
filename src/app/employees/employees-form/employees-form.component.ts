import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { CreateEmployeeDto } from "src/shared/dtos/create-employee.dto";
import { Employees } from "src/shared/entities/employees.entity";
import { EmployeeService } from "src/shared/services/employee.service";

@Component({
    selector: 'app-employees-form',
    templateUrl: './employees-form.component.html',
})
export class EmployeesFormComponent {
    @Output()
    private submitEvent = new EventEmitter<Employees>();

    private apiSubscription!: Subscription;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly employeesService: EmployeeService,
    ) {}

    public employeesForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        mail: ['', Validators.required],
        password: ['', Validators.required],
    });

    public onSubmit(): void {
        if(this.employeesForm.valid) {
            const employee: CreateEmployeeDto = this.employeesForm.value as CreateEmployeeDto;
            this.apiSubscription = this.employeesService.create(employee).subscribe({
                'next': (result) => {
                    this.submitEvent.emit(result);
                }
            });
        }
    }
}