import { Component } from '@angular/core';
import { FormBuilder,FormGroup,FormControl } from '@angular/forms';
import { FormDemoServiceService } from 'src/app/services/form-demo/form-demo-service.service';
@Component({
  selector: 'app-form-demo',
  standalone: false,
  templateUrl: './form-demo.component.html',
  styleUrl: './form-demo.component.scss'
})
export class FormDemoComponent {
             /* import form group ,form builder, form control */
      /* first_name, last_name age , email */
      demoForm: FormGroup;
 constructor(private fb: FormBuilder,private demoService : FormDemoServiceService){
    this.demoForm = this.fb.group({
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          age: new FormControl(''),
          email: new FormControl('')
    });
 }
onSubmit(){
    console.log('form submitted');
    console.log(this.demoForm.value);


    this.demoService.serviceCall(this.demoForm.value).subscribe((response)=>{
         console.log('server response: ' , response);
    });
}

}
