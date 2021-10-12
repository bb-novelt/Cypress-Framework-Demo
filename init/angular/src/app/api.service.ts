import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private boats$ = new BehaviorSubject<any[]>([]);

  constructor(public http: HttpClient) {

  }

  refreshBoats(): any {
    this.http.get("http://localhost:8080/listBoat").subscribe((data: any) => {
      console.log("data :", data);
      this.boats$.next(data);
    });
  }
  getBoats(): any {
    return this.boats$;
  }

  addBoat(name: any) {
    return this.http.post("http://localhost:8080/addBoat", {name});
  }

  setCaptain(boatId:any, captain: any) {
    console.log("setCaptain :", {boatId, captain})
    return this.http.post("http://localhost:8080/setCaptain", {captain,boatId});
  }

  delete(_id: any) {
    console.log("delete :", {_id})
    return this.http.post("http://localhost:8080/delete", {_id});
  }
}
