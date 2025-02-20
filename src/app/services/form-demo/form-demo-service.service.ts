import { HttpService } from 'src/app/services/http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { request } from 'http';

@Injectable({
  providedIn: 'root'
})
export class FormDemoServiceService {

  constructor(private http: HttpClient,private httpService: HttpService) {



              /* http client*/
             /* hGet,POST,Delete, Put*/
   }
   serviceCall(form_details: any = {}) {
    console.log("In the service");
    const requestUrl = environment.baseUrl + '/form-demo';   //http://localhost:8080/form-demo
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    return this.http.post(requestUrl, form_details, { headers: headers });
}


}
