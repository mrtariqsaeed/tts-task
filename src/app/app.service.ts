import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Hotel, Report } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  getHotelsURL = environment.getHotelsURL;
  getReportURL = environment.getReportURL;

  constructor(private http: HttpClient) { }

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.getHotelsURL)
  }

  getReport(body: any): Observable<Report[]> {

    return this.http.post<Report[]>(this.getReportURL, body)
  }
}