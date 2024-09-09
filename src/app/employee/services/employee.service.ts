import { Injectable } from '@angular/core';
import { END_POINTS } from '../../core/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../types';

const API = END_POINTS.Employees;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {}

  create(model: Employee): Observable<any> {
    return this.http.post<any>(API.create, model);
  }

  get(): Observable< Employee > {
    return this.http.get< Employee>(API.list );
  }

  getByID(id: string): Observable<Employee> {
    return this.http.get<Employee>(API.getById(id));
  }
  delete(id: string): any {
    return this.http.delete(API.getById(id),{
      responseType:'text'
    });
  }
  update(id: string,model: Employee): Observable<Employee> {
    return this.http.put<Employee>(API.update(id), model);
  }

}
