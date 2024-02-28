import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  userReg: FormGroup;
  countries: any;
  stateList: any;
  citiList: any;
  employeeId: any;
  selectedCountry: any;
  name: string = '';
  filteredStates: any;
  filteredCities: any;
  city: any;
  state: any;

  displayedColumns: string[] = ['id', 'empname', 'date', 'mobnum', 'Gender', 'address', 'selectedCountry', 'selectedState', 'selectedCity', 'action', 'delete'];
  employeeData: any;
  valueGet: any;



  constructor(private fb: FormBuilder,
    private httpClient: HttpClient,
    private matDialog: MatDialog,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private apiService: ApiServicesService,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userReg = this.fb.group({
      fullname: ['', [Validators.required, Validators.maxLength(20)]],
      mobnum: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email]],
      date: ['', [Validators.required]],
      address: ['', Validators.required],
      selectedCountry: ['', Validators.required],
      selectedState: ['', Validators.required],
      selectedCity: ['', Validators.required],
      Gender: ['', Validators.required],
      createPass: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
      confirmPass: ['', [Validators.required, this.matchPasswords.bind(this)]]
    }, { validator: this.matchPasswords });



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

  ngOnInit() {

    this.activeRoute.params.subscribe((paramsId: any) => {
      this.employeeId = paramsId
    })

    if (this.employeeId.id) {
      this.getEmployeDetails();
    } else {
      this.JsonData();
    }
  }

  getEmployeDetails() {
    this.apiService.getEmployeeDetails().subscribe({
      next: (res) => {
        this.data = res;
        this.data.forEach((items: any) => {
          if (items.id === Number(this.employeeId.id)) {
            this.employeeData = items;
            this.userReg.patchValue(items)
            this.fetchJsonData();
          }
        })
      },
      error: console.log,

    })
  }

  JsonData() {
    this.apiService.getCountryData().subscribe((data) => {
      this.countries = data;
    })
    this.apiService.getStateData().subscribe((data) => {
      this.stateList = data;
    })
    this.apiService.getCityData().subscribe((data) => {
      this.citiList = data;
    })
  }


  fetchJsonData() {

    console.log(this.employeeData)
    this.apiService.getCountryData().subscribe((data) => {
      this.countries = data;
    })

    this.apiService.getStateData().subscribe((data) => {
      this.stateList = data;
      if (this.employeeData.selectedCountry) {
        this.filteredStates = [];
        this.stateList.forEach((items: any) => {
          if (items.countryname === this.employeeData.selectedCountry) {
            this.filteredStates = [...this.filteredStates, items]
          }
        }
        );
        console.log(this.filteredStates)
      }
    })

    this.apiService.getCityData().subscribe((data) => {
      this.citiList = data;

      if (this.employeeData.selectedState) {
        this.filteredCities = [];
        this.citiList.forEach((items: any) => {
          if (items.statename === this.employeeData.selectedState) {
            this.filteredCities = [...this.filteredCities, items]
          }
        })
      }
    })
  }

  onCountryChange() {

    const selectedCountry = this.getSelectedCountry();
    const countryData = this.getCountryData(selectedCountry);
    this.filteredStates = this.getFilteredStates(countryData);
    this.updateStateAndCity(countryData);
    this.resetFormControls();
  }

  getSelectedCountry(): string {
    return this.userReg.value.selectedCountry;
  }

  getCountryData(selectedCountry: string): any {
    return this.countries.find((country: { countryname: any; }) => country.countryname === selectedCountry);
  }

  getFilteredStates(countryData: any): any[] {
    if (countryData) {
      const selectedCountryname = countryData.countryname;
      return this.stateList.filter((state: { countryname: any; }) => state.countryname === selectedCountryname);
    } else {
      return [];
    }
  }

  updateStateAndCity(countryData: any) {
    if (countryData) {
      this.state = countryData.states;
      this.userReg.controls['selectedCity'].reset();
      this.city = [];
    } else {
      this.state = [];
    }
  }

  resetFormControls(): void {
    this.userReg.patchValue({ selectedState: '' });
    this.city = [];
    this.filteredCities = [];
    this.city = [];
  }

  onStateChange(event: any) {

    const selectedState = this.userReg.value.selectedState;
    const stateData = this.stateList.find((state: { statename: any; }) => state.statename === selectedState);
    if (stateData) {
      const selectedStatename = stateData.statename;
      this.filteredCities = this.citiList.filter((city: any) => city.statename === selectedStatename);
    } else {
      this.filteredCities = [];
    }

    this.userReg.patchValue({ selectedCity: '' });
    this.city = [];


  }

  onSubmit() {

    if (this.userReg.valid) {
      const formData = this.userReg.value;
      console.log(formData);

      if (this.employeeId.id) { 
        console.log(this.data)
        const employeeId = this.employeeId.id; 
        this.httpClient.put(`https://retoolapi.dev/lcqe0N/empData/${employeeId}`, formData).subscribe({
          next: (val: any) => {
            alert("Employee Detail Updated");
            this.router.navigate(['/userReport']);
          },
          error: (err) => {
            console.error("Error updating employee details:", err);
            alert("Failed to update employee details. Please try again.");
          }
        });
      } else {
        this.httpClient.post('https://retoolapi.dev/lcqe0N/empData', formData).subscribe({
          next: (data: any) => {
            alert("Registered Successfully");
            this.router.navigate(['/userReport']);
          },
          error: (err) => {
            console.error("Error registering employee:", err);
            alert("Failed to register employee. Please try again.");
          }
        });
      }
    } else {
      alert("Need to Fill All Fields...");
    }
  }
  onReset() {
    location.reload();
  }
}

  