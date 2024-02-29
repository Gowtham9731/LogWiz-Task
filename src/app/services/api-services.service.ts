import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
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
  reportForm: any;
  genderData: any;
  dataCopy: any;
  dataSource: any;

  constructor(private httpClient: HttpClient) { }

  getData(): Observable<any> {
    return this.httpClient.get<any>('https://retoolapi.dev/ah0eW7/empreg');
  }



  matchPasswords(formGroup: FormGroup) {
    const password = formGroup.get('createPass')?.value;
    const confirmPassword = formGroup.get('confirmPass')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPass')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPass')?.setErrors(null);
    }
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

  getFilteredCountry(selectedCountry: string,filterGender: any): any[] {
    if (selectedCountry) {
      return filterGender.filter((country: { selectedCountry: any; }) => country.selectedCountry === selectedCountry);
    } else {
      return [];
    }
  }

  filteredStates(selectedCountry: string,filterCountry: any): any[] {
    if (selectedCountry) {
      return filterCountry.filter((state: { selectedState: any; }) => state.selectedState === selectedCountry);
    } else {
      return [];
    }
  }

  getFilteredStates(selectedCountry: string,stateList: any): any[] {
    if (selectedCountry) {
      return stateList.filter((state: { countryname: any; }) => state.countryname === selectedCountry);
    } else {
      return [];
    }
  }

  getFilteredCities(selectedState: string,citiList: any): any[] {
    if (selectedState) {
      return citiList.filter((city: any) => city.statename === selectedState);
    } else {
      return [];
    }
  }

  getFilteredGender(selectedGender: string,dataCopy: any): any[] {
    if (selectedGender) {
      return dataCopy.filter((item: { Gender: any; }) => item.Gender === selectedGender);
    } else {
      return [];
    }
  }

   // updateStateAndCity(selectedCountry: any) {
  //   if (selectedCountry) {
  //     this.userReg.controls['selectedCity'].reset();
  //     this.city = [];
  //   } else {
  //     this.state = [];
  //   }
  // }

  // updateCity(selectedState : any){
  //   if (selectedState) {
  //     return this.filteredCities=this.getFilteredCities(selectedState,this.citiList);
  //   } else {
  //     this.filteredCities = [];

  //   }
  // }

  
 
}


