import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,FormControl, Validators, AbstractControl, FormGroupDirective } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { privateDecrypt } from 'crypto';
import { FormDemoServiceService } from 'src/app/services/form-demo/form-demo-service.service';


export interface PeriodicElement {
  name: string;
  position: number;

  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-form-demo',
  standalone: false,
  templateUrl: './form-demo.component.html',
  styleUrl: './form-demo.component.scss'
})
export class FormDemoComponent implements OnInit {
      demoForm: FormGroup;
      displayedColumns: string[] = ['firstName', 'lastName', 'age', 'email', 'actions'];
      dataSource = new MatTableDataSource<any>;
      @ViewChild(MatPaginator) paginator: MatPaginator;
      @ViewChild(MatSort) sort: MatSort;

      saveButtonLabel = 'Save';
      mode = 'add';
      selectedData;
      isButtonDisabled: boolean = false;
      submitted: any;



 constructor(
  private fb: FormBuilder,
  private demoService: FormDemoServiceService,
  private MessageService: MessageServiceService

  ){
    // required, min ,max , minL ,pattern, customValidation
    this.demoForm = this.fb.group({
          firstName: new FormControl('' , Validators.required),
          lastName: new FormControl('' ,  [Validators.required,Validators.minLength(3), Validators.maxLength(8)]),
          age: new FormControl('', [Validators.required,Validators.min(14),Validators.max(120), this.customeAgeValidator]),
          email: new FormControl('' , [Validators.required,Validators.email]  ) //Validators.email
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



// public populateData(): void{
//     //implemet get data code
//     //ts -> service file function
//     // service -> backend call
//     this.demoService.getData().subscribe((response: any[]) => {
//        console.log('get data response' , response);

//        this.dataSource = new MatTableDataSource(response);
//        this.dataSource.paginator = this.paginator;
//        this.dataSource.sort =this.sort;
//     });
// }


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
    console.log('Mode ' + this.mode);
    console.log('form submitted');
    console.log(this.demoForm.value);

    this.submitted = true;
    if(this.mode == 'add'){
  //     this.demoService.serviceCall(this.demoForm.value).subscribe((response)=>{

  //       if(this.dataSource && this.dataSource.data && this.dataSource.data.length>0){
  //            this.dataSource = new MatTableDataSource([response, ...this.dataSource.data])
  //       } else{
  //         this.dataSource = new MatTableDataSource([response]); //input data goes to the top of the display
  //       }

  //       this.MessageService.showSuccess('Data saved successfully!');
  //  });
  this.demoService.serviceCall(this.demoForm.value).subscribe({
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
      //  this.demoService.editData(this.selectedData?.id, this.demoForm.value).subscribe((response) =>{
      //    let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
      //    this.dataSource.data[elementIndex] = response;
      //    this.dataSource = new MatTableDataSource(this.dataSource.data);
      //    this.MessageService.showSuccess('Data  edited successfully!');

      //  });
      console.log('Mode ' + this.mode);

      this.demoService.editData(this.selectedData?.id, this.demoForm.value).subscribe({
          next: (response: any)=>{
            console.log("put data Server Response", response);
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
      this.demoForm.disable(); // automatically disable the form after submitting form data
      this.isButtonDisabled = true;
  }catch(error){

        this.MessageService.showError('Action failed with error' + error);
  }
}
public resetData(formDirective:FormGroupDirective): void {
  this.demoForm.reset();
  formDirective.resetForm()
  this.demoForm.setErrors = null;
  this.demoForm.updateValueAndValidity();
  this.saveButtonLabel = 'save';
  this.demoForm.enable();
  this.isButtonDisabled = false;
  this.submitted = false;
}

public editData(data:any): void {
  this.demoForm.patchValue(data);
  this.saveButtonLabel = "Edit";
  this.mode = 'edit';
  this.selectedData = data;
}

public deleteData(data:any): void {

// data delete implementation

const id = data.id;

try{
  // this.demoService.deleteData(id).subscribe((response) => {
  //   const index = this.dataSource.data.findIndex((element) => element.id == id);
  //   if(index !== -1){
  //      this.dataSource.data.splice( index,1 );
  //   }
  //   this.dataSource = new MatTableDataSource(this.dataSource.data);
  //   this.MessageService.showSuccess('Data deleted successfully!');
  //   });

  this.demoService.deleteData(id).subscribe({
    next: (response: any)=>{
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
}
