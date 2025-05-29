import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeServiceService } from 'src/app/services/employee/employee-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-employee',
  standalone:false,
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit{

 employeeForm: FormGroup;
 displayedColumns: string[] = ['firstName', 'lastName', 'age','gender','email','phoneNumber','address', 'actions'];
  dataSource = new MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData: any;
  isButtonDisabled: boolean = false;
  submitted: boolean;
   today: Date = new Date();

  customerService: any;
customerForm: FormGroup<any>;
  constructor(
    private fb: FormBuilder,
    private demoService: EmployeeServiceService,
    private MessageService: MessageServiceService

    ){
    this.employeeForm = this.fb.group({
      imageUpload: new FormControl('' , Validators.required),
      employeeNumber: new FormControl('' , Validators.required),
      fullName: new FormControl('' , Validators.required ),
      firstName: new FormControl('' , Validators.required),
      lastName: new FormControl('' ,  Validators.required),
      nic: new FormControl('' , [Validators.required , Validators.pattern('^([0-9]{9}[vVxX]|[0-9]{12})$') ]),
      role: new FormControl('' , Validators.required),
      birthDate: new FormControl('' , Validators.required),
      age: new FormControl('', [Validators.required,Validators.min(14),Validators.max(120)]),
      gender: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required,Validators.min(14),Validators.max(120)]),
      phoneNumber: new FormControl('', [ Validators.required,Validators.pattern('^[0-9]{10}$')  ]),
      email: new FormControl('' , [Validators.required,Validators.email]),
      emergencyPhoneNumber: new FormControl('' , Validators.required),


    });
  }


  ngOnInit(): void {
  //get data requets
  this.populateData();
}

customeAgeValidator(control: AbstractControl) {
  if (!control) {
    return null;
  }
  const controlValue = +control.value; // FIXED: Corrected variable name

  if (isNaN(controlValue)) {
    return { customAgeValidator: true };
  }

  return null;
}

public populateData(): void{
  //implemet get data code
  //ts -> service file function
  // service -> backend call

  try{
    this.demoService.getData().subscribe({
       next: (dataList: any[]) => {
         if (dataList.length <= 0){
            return;
         }
        this.dataSource = new MatTableDataSource(dataList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort =this.sort;
      console.log(dataList);

       }, error:(error)=> {
        this.MessageService.showError('Action failed with error' + error);
       }
    });
  }catch(error){
    this.MessageService.showError('Action failed with error' + error);
  }
  }

  onSubmit(){
    try{
      console.log('Mode' + this.mode);
      console.log('form submitted');
      console.log(this.employeeForm.value);

      this.submitted = true;
      if(this.mode == 'add'){

    this.demoService.serviceCall(this.employeeForm.value).subscribe({
      next: (response: any) => {
        if(this.dataSource && this.dataSource.data && this.dataSource.data.length>0){
                     this.dataSource = new MatTableDataSource([response, ...this.dataSource.data])
                } else{
                  this.dataSource = new MatTableDataSource([response]); //input data goes to the top of the display
                }

                this.MessageService.showSuccess('Data saved successfully!');
           },
           error: (error)=> {
               this.MessageService.showError('Action failed with erro' + error);
           }
  });

      } else if (this.mode === 'edit'){


        this.demoService.editData(this.selectedData?.id, this.employeeForm.value).subscribe({
            next: (response: any)=>{
           let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
           this.dataSource.data[elementIndex] = response;
           this.dataSource = new MatTableDataSource(this.dataSource.data);
           this.MessageService.showSuccess('Data  edited successfully!');
            },
            error: (error)=> {
              this.MessageService.showError('Action failed with erro' + error);
          }
        });
      }
        this.mode = 'add';
        this.employeeForm.disable(); // automatically disable the form after submitting form data
        this.isButtonDisabled = true;
    }catch(error){
     this.MessageService.showError('Action failed with error' + error);
    }
  }

  public resetData(formDirective:FormGroupDirective): void {
    formDirective.resetForm()
    this.employeeForm.reset();
    this.employeeForm.setErrors = null;
    this.employeeForm.updateValueAndValidity();
    this.saveButtonLabel = 'save';
    this.employeeForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data:any): void {
    this.employeeForm.patchValue(data);
    this.saveButtonLabel = "Edit";
    this.mode = 'edit';
    this.selectedData = data;
  }


public deleteData(data:any): void {
  const id = data.id;
  try{
    this.demoService.deleteData(id).subscribe({
      next: (_response: any)=>{
        const index = this.dataSource.data.findIndex((element) => element.id == id);
        if(index !== -1){
           this.dataSource.data.splice( index,1 );
        }
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.MessageService.showSuccess('Data deleted successfully!');
      },   error: (error)=> {
        this.MessageService.showError('Action failed with erro' + error);
    }
      });
  }catch(error){

    this.MessageService.showError('Action failed with error' + error);}
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
    }}

    public refreshData(): void {
       this.populateData();
       }

     // file upload
     selectedFileName: string = '';

     onFileChange(event: any): void {
       const file = event.target.files[0];
       if (file) {
         this.selectedFileName = file.name;
         this.employeeForm.patchValue({
           imageUpload: file
         });
       }
     }
    //birthdate changes age calculation
  age: number = 0;

onBirthDateChange(event: any): void {
  const selectedDate: Date = event.value;
  this.age = this.calculateAge(selectedDate);
  this.employeeForm.get('age')?.setValue(this.age);
  this.employeeForm.get('age')?.markAsTouched();
  this.employeeForm.get('age')?.updateValueAndValidity();
}
calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
 } }

