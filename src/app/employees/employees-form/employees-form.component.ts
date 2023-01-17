import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, Validators } from '@angular/forms';
import { isNil } from "lodash";
import { Subscription } from "rxjs";
import { CreateEmployeeDto } from "src/shared/dtos/create-employee.dto";
import { PutEmployeeDto } from "src/shared/dtos/put-employee.dto";
import { Employees } from "src/shared/entities/employees.entity";
import { EmployeeService } from "src/shared/services/employee.service";

@Component({
    selector: 'app-employees-form',
    templateUrl: './employees-form.component.html',
})
export class EmployeesFormComponent implements OnChanges {
    @Input('employeeToHandle')
    public employee!: Employees | undefined;

    @Output()
    private submitEvent = new EventEmitter<Employees>();

    public employeesForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        mail: ['', Validators.required],
        password: ['', Validators.required],
    });

    private apiSubscription!: Subscription;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly employeesService: EmployeeService,
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        const employee = changes['employee'].currentValue;
        if (!isNil(employee)) {
            this.employeesForm.patchValue({
                firstName: employee.firstName,
                lastName: employee.lastName,
                mail: employee.mail,
                password: employee.password,
            });
        } else {
            this.employeesForm.patchValue({
                firstName: undefined,
                lastName: undefined,
                mail: undefined,
                password: undefined,
            });
        }
    }

    public onSubmit(): void {
        if(this.employeesForm.valid) {
            if (isNil(this.employee)) {
                const employee: CreateEmployeeDto = this.employeesForm.value as CreateEmployeeDto;
                this.apiSubscription = this.employeesService.create(employee).subscribe({
                    'next': (result) => {
                        this.submitEvent.emit(result);
                    },
                    'complete': () => {
                        this.apiSubscription.unsubscribe();
                    }
                });
            } else {
                const employee: PutEmployeeDto = this.employeesForm.value as PutEmployeeDto;
                employee.id = this.employee.id;

                this.apiSubscription = this.employeesService.put(this.employee.id, employee).subscribe({
                    'next': (result) => {
                        this.submitEvent.emit(result);
                    },
                    'complete': () => {
                        this.apiSubscription.unsubscribe();
                    }
                });
            }
        }
    }
}