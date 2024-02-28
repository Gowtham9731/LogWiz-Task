import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss']
})
export class UserReportComponent {

  displayedColumns: string[] = ['id', 'empname', 'date', 'mobnum', 'Gender', 'address', 'selectedCountry', 'selectedState', 'selectedCity', 'action', 'delete'];

  public empDetails: any = [];
  emp: any;

  dataSource!: MatTableDataSource<any>;
  router: any;

  reportForm: FormGroup;
  dataCopy: any;

  searchName: string = '';
  countryName: string = '';
  stateName: string = '';
  genderName: string = '';
  selectedCountry: any;

  gender: string = '';
  genderValue: any;
  countryValue: any;
  genderData: any;
  filteredCountryData: any;
  searchState: any;
  selectedGender: any;
  paithiyam: any;
  allgender: any;
  mudiyala: any;
  allGenderArray: any;
  AllGenderValues: any;
  uniqueGendersSet: any;
  countries: any;
  stateList: any;
  citiList: any;
  filteredStateData: any;
  stateValue: any;
  countryDa: any;
  filteredStates: any;
  state: any;

  constructor(private fb: FormBuilder,
    private httpClient: HttpClient,
    public routing: Router,
    private matDialog: MatDialog,
    private apiService: ApiServicesService,
  ) {

    this.reportForm = this.fb.group({
      genderName: [''],
      countryName: [''],
      stateName: [''],
      searchName: [''],

    })

  }

  ngOnInit() {

    this.getEmployeDetails();

    this.JsonData();

  }

  getEmployeDetails() {
    this.apiService.getEmployeeDetails().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);

        this.dataCopy = res;

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

  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onCountryFilter() {
    this.countryValue = this.reportForm.value.countryName;
    this.filteredStates = this.stateList.filter((state: { countryname: any; }) => state.countryname === this.countryValue);
    console.log(this.filteredStates)

    this.countryDa = this.countries.find((country: { countryname: any; }) => country.countryname === this.countryValue);
    console.log(this.countryDa)


    if (this.genderData) {
      this.filteredCountryData = this.genderData.filter((item: any) => item.selectedCountry === this.countryValue);
      console.log(this.filteredCountryData)
      this.dataSource = this.filteredCountryData;

    } else {
      alert('select the Gender');
      this.filteredCountryData = [];
      this.reportForm.patchValue({ countryName: '' });
    }


  }

  genderFilter() {

    const selectedGender = this.reportForm.value.genderName;
    console.log(selectedGender);

    this.genderData = this.dataCopy.filter((item: { Gender: string; }) => item.Gender.toLowerCase() === selectedGender);
    this.dataSource = this.genderData;
  }

  stateFilter() {

    const stateValue = this.reportForm.value.stateName;
    console.log(stateValue)

    this.stateValue = this.reportForm.value.stateName;

    if (this.filteredCountryData) {
      this.filteredStateData = this.filteredCountryData.filter((item: any) => item.selectedState === this.stateValue);
      console.log(this.filteredStateData)

      this.dataSource = this.filteredStateData;

    } else {
      alert('select the Country');
      this.filteredStateData = [];
      this.reportForm.patchValue({ stateName: '' });
    }

  }
  toClear() {

    this.reportForm.reset();
    this.getEmployeDetails();

  }


  deleteEmployee(id: number) {
    this.apiService.deleteUser(id).subscribe({
      next: (res) => {
        alert('successFull Deleted')
        this.getEmployeDetails();
      },
      error: console.log,

    })
  }

  editEmployee(data: any) {

    this.routing.navigateByUrl(`userReport-edit/${data.id}`).then(() => {
      this.getEmployeDetails();
    }).catch(error => {
      console.error('Navigation error:', error);
    });


  }

  addEmployee() {
    this.router.navigateByUrl('/userRegister');
  }
}




