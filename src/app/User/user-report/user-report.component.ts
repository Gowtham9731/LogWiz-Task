import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss']
})
export class UserReportComponent {

  displayedColumns: string[] = ['id', 'empname', 'date', 'mobnum', 'Gender', 'address', 'selectedCountry', 'selectedState', 'selectedCity', 'action', 'delete'];

  dataSource!: MatTableDataSource<any>;

  reportForm: FormGroup;
  dataCopy: any;

  searchName: string = '';
  countryName: string = '';
  stateName: string = '';
  genderName: string = '';
  selectedCountry: any;

  countryValue: any;
  genderData: any;
  filteredCountryData: any;
  countries: any;
  stateList: any;
  citiList: any;
  filteredStateData: any;
  stateValue: any;
  countryDa: any;
  filteredStates: any;
  state: any;
  filteredCities: any;
  filterCountry: any;
  filterGender: any;
  filteredstateValues: any;

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

    this.AllapiData();

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

  AllapiData() {
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

  genderFilter(event: any) {
    const genderValue = event.value;
    this.filterGender = this.apiService.getFilteredGender(genderValue, this.dataCopy);
    this.dataSource = this.filterGender;
  }

  onCountryFilter(event: any) {
    this.countryValue = event.value;
    this.filteredStates = this.apiService.getFilteredStates(this.countryValue, this.stateList)
    if (this.filterGender) {
      this.filterCountry = this.apiService.getFilteredCountry(this.countryValue, this.filterGender);
      this.dataSource = this.filterCountry;
    } else {
      Swal.fire('Warning...', "First Select Gender", 'warning')
      this.filterCountry = [];
      this.filteredStates = [];
      this.reportForm.patchValue({ countryName: '' });
    }

  }

  stateFilter(event: any) {
    const stateValue = event.value;
    if (stateValue) {
      this.filteredstateValues = this.apiService.filteredStates(stateValue, this.filterCountry);
      this.dataSource = this.filteredstateValues;
    } else {
      Swal.fire('Warning...', "First Select Country", 'warning');
      this.reportForm.patchValue({ stateName: '' });
    }

  }


  toClear() {
    this.reportForm.reset();
    this.getEmployeDetails();
  }


  deleteEmployee(id: number) {

    Swal.fire({
      title: 'Aru You Want to Delete?',
      text: 'You will not able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes Delete It',
      cancelButtonText: 'No Keep it'
    }).then((result) => {
      if (result.value) {
        this.apiService.deleteUser(id).subscribe({
          next: (res) => {
            Swal.fire('Deleted', 'Your File has been Deleted', 'success');
            this.getEmployeDetails();
          },
          error: console.log,
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your File is Safe', 'error');
      }
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
    this.routing.navigateByUrl('/userRegister');
  }
}




