import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BoatListComponent} from "./boat-list/boat-list.component";
import {BoatComponent} from "./boat/boat.component";

const routes: Routes = [
  { path: 'boat/:id', component: BoatComponent },
  { path: '', component: BoatListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
