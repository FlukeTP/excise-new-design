import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import _ from 'lodash';

@Injectable()
export class ProvinceService {
     provinces: Province[] = [];
     amphures: Amphures[] = [];
     districts: Districts[] = [];
     zipcodes: Zipcodes[] = [];
     geography: Geography[] = [];
     constructor(private http: HttpClient) {
          this.getProvincesJSON().subscribe(data => {
               // console.log("FROM JSON [Provinces] => ", data);
               this.provinces = data;
          });
          this.getAmphuresJSON().subscribe(data => {
               // console.log("FROM JSON [Amphures] => ", data);
               this.amphures = data;
          });
          this.getDistrictsJSON().subscribe(data => {
               // console.log("FROM JSON [Districts] => ", data);
               this.districts = data;
          });
          this.getZipcodesJSON().subscribe(data => {
               // console.log("FROM JSON [Zipcodes] => ", data);
               this.zipcodes = data;
          });
          this.getGeoGraphyJSON().subscribe(data => {
               // console.log("FROM JSON [Geography] => ", data);
               this.geography = data;
          });
     }

     public findByProvince(province_id: string): Amphures[] {
          return this.amphures.filter(obj => obj.province_id == province_id);
     }

     public findByAmphure(amphur_id: string): Districts[] {
          return this.districts.filter(obj => obj.amphur_id == amphur_id);
     }

     public findByDistrictCode(district_code: string): Zipcodes[] {
          return this.zipcodes.filter(obj => obj.district_code == district_code);
     }

     public getProvincesJSON(): Observable<Province[]> {
          return this.http.get<Province[]>("./assets/json/provinces.json");
     }

     private getAmphuresJSON(): Observable<Amphures[]> {
          return this.http.get<Amphures[]>("./assets/json/amphures.json");
     }

     private getDistrictsJSON(): Observable<Districts[]> {
          return this.http.get<Districts[]>("./assets/json/districts.json");
     }

     private getZipcodesJSON(): Observable<Zipcodes[]> {
          return this.http.get<Zipcodes[]>("./assets/json/zipcodes.json");
     }

     private getGeoGraphyJSON(): Observable<Geography[]> {
          return this.http.get<Geography[]>("./assets/json/geography.json");
     }
}

export interface Province {
     geo_id: string;
     province_code: string;
     province_id: string;
     province_name: string;
     province_name_eng: string;
}

export interface Amphures {
     amphur_code: string;
     amphur_id: string;
     amphur_name: string;
     amphur_name_eng: string;
     geo_id: string;
     province_id: string;
}

export interface Districts {
     amphur_id: string;
     district_code: string;
     district_id: string;
     district_name: string;
     district_name_eng: string;
     geo_id: string;
     province_id: string;
}

export interface Zipcodes {
     district_code: string;
     zipcode_id: string;
     zipcode_name: string;
}

export interface Geography {
     geo_id: string;
     geo_name: string;
}