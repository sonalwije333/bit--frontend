import { Component } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-customer',
  standalone:false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {

  customerForm: FormGroup;

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

    console.log('form submitted');
    console.log(this.customerForm.value);
  }

}

