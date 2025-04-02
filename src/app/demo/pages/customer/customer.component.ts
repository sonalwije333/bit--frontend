import { Component } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customer',
  standalone:false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {

  customerForm: FormGroup;
  customerService: any;
  mode: string;
  submitted: boolean;
  dataSource: any;
  MessageService: any;
  demoService: any;
  selectedData: any;
  isButtonDisabled: boolean;

  constructor(private fb: FormBuilder){
    this.customerForm = this.fb.group({
      firstName: new FormControl('' , Validators.required),
      lastName: new FormControl('' ,  [Validators.required,Validators.minLength(3), Validators.maxLength(8)]),
      age: new FormControl('', [Validators.required,Validators.min(14),Validators.max(120)]),
      gender: new FormControl('', [Validators.required]),
      email: new FormControl('' , [Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ')]  ), //Validators.email
      phoneNumber: new FormControl('', [Validators.required,Validators.min(0),Validators.max(10)]),
      address: new FormControl('', [Validators.required,Validators.min(14),Validators.max(120)]),
    });
  }

  onSubmit(){
    try{
      console.log('Mode' + this.mode);
      console.log('form submitted');
      console.log(this.customerForm.value);

      this.submitted = true;
      if(this.mode == 'add'){

    this.customerService.serviceCall(this.customerForm.value).subscribe({
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


        this.demoService.editData(this.selectedData?.id, this.customerForm.value).subscribe({
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
        this.customerForm.disable(); // automatically disable the form after submitting form data
        this.isButtonDisabled = true;
    }catch(error){

          this.MessageService.showError('Action failed with error' + error);
    }
  }

}

