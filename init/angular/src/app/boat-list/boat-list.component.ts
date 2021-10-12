import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-boat-list',
  templateUrl: './boat-list.component.html',
  styleUrls: ['./boat-list.component.less']
})
export class BoatListComponent implements OnInit {
  public boats: any;
  public newName: any;
  public success: boolean = false;

  constructor(public api: ApiService) {
  }

  ngOnInit(): void {
    this.api.getBoats().subscribe((data: any) => {
      console.log("data :", data);
      this.boats = data;
    });
    this.api.refreshBoats();
  }

  onAdd() {
    this.api.addBoat(this.newName).subscribe((data: any) => {
      console.log("addBoat :", data);
      this.success = true;
      this.api.refreshBoats();
      this.newName = "";
    });
  }
}
