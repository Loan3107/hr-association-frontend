import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Employees } from "../entities/employees.entity";
import { CreateEmployeeDto } from "../dtos/create-employee.dto";

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    constructor(private readonly http: HttpClient) {}

    private configUrl = environment.apiUrl; 
    private httpOptions = { 
        headers: new HttpHeaders({
            'Content-Type': 'application/json', 
        })
    };

    public getEmployees(): Observable<Employees[]> {
        return this.http.get<Employees[]>(`${this.configUrl}/employees`, this.httpOptions);
    }

    public create(employee: CreateEmployeeDto): Observable<Employees> {
        return this.http.post<Employees>(`${this.configUrl}/employees`, employee, this.httpOptions);
    }

    public delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.configUrl}/employees/${id}`, this.httpOptions);
    }
}