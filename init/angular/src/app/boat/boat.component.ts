import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-boat',
  templateUrl: './boat.component.html',
  styleUrls: ['./boat.component.less']
})
export class BoatComponent implements OnInit {
  public boat: any;
  captains: any;
  captainSelected: any;
  public success: boolean = false;

  constructor(public api: ApiService,
              public route: ActivatedRoute,
              private router: Router
  ) {
    this.captains =  [
      "No captain",
      "Jack Sparrow",
      "Rackham le Rouge",
      "Sir Francis Drake",
      "Henry Morgan",
    ];
    this.captainSelected = "No captain";
  }

  ngOnInit(): void {
    this.api.getBoats().subscribe((data: any) => {
      data.forEach((boat:any) => {
        if (boat._id==this.route.snapshot.params['id']) {
          this.boat = boat;
          this.captainSelected = this.captains[0]
            if (boat.captain)
              this.captainSelected = boat.captain
        }
      });
      console.log("boat :",  this.boat);
    });
    this.api.refreshBoats();
  }


  onCaptainChange(captain:any){
    this.api.setCaptain(this.boat._id, captain).subscribe((data: any) => {
      console.log("setCaptain :", data);
      this.success = true;
      this.api.refreshBoats();
    });
  }

  // delete(_id: any) {
  //   this.api.delete(this.boat._id).subscribe((data: any) => {
  //     console.log("delete :", data);
  //     this.api.refreshBoats();
  //     this.router.navigate([""])
  //   });
  // }
}
