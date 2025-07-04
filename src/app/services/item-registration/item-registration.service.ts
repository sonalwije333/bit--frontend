import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ItemRegistrationService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {}

  serviceCall(formData: FormData) {
    console.log('In the service');

    const requestUrl = environment.baseUrl + '/item';
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.post(requestUrl, formData, { headers: headers });
  }

  getData() {
    const requestUrl = environment.baseUrl + '/item';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.get(requestUrl, headers);
  }

  editData(id: any, form_details: any) {
    console.log('In the Edit data');

    const requestUrl = environment.baseUrl + '/item/' + id.toString();
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.put(requestUrl, form_details, { headers: headers });
  }

  deleteData(id: any) {
    console.log('In the Delete data');

    const requestUrl = environment.baseUrl + '/item/' + id.toString();
    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.delete(requestUrl, { headers: headers });
  }
}
