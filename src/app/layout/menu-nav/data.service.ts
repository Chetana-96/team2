import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DataService {
    url : string='https://4fe74f2b.ngrok.io/api/Patient';

  constructor(private _http:HttpClient) { }

  getAllSpeciality() {
    return this._http.get(this.url);
  }

}
