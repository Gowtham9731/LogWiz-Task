import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  userReg: any;
 
  countries: any;
  stateList: any;
  citiList: any;
  countryList: any;
  trailForm: any;
  city: any;
  filteredCities: any;
  state: any;

  constructor(private httpClient: HttpClient) { }

  getData(): Observable<any> {
    return this.httpClient.get<any>('https://retoolapi.dev/ah0eW7/empreg');
  }

 
  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete(`https://retoolapi.dev/lcqe0N/empData/${id}`)
      .pipe(
        catchError(error => {
          console.error('Delete request error:', error);
          return throwError(error);
        })
      );
  }

  
  getCountryData(): Observable<any> {
    return this.httpClient.get('http://localhost:3000/country');
  }
  getStateData(): Observable<any> {
    return this.httpClient.get('http://localhost:3000/States');
  }
  getCityData(): Observable<any> {
    return this.httpClient.get('http://localhost:3000/cities');
  }

  getCountryValue(event: any): string {
    return event.value;
  }

  getUpdateEmployee(id: number, data: any): Observable<any> {
    return this.httpClient.put(`https://retoolapi.dev/lcqe0N/empData/${id}`, data);

  }

  getEmployeeDetails(): Observable<any> {
    return this.httpClient.get('https://retoolapi.dev/lcqe0N/empData');
  }

 
}


