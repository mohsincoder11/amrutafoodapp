import { NgForm } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { DataService } from "./../Services/data.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
@Component({
  selector: "app-updatepass",
  templateUrl: "./updatepass.page.html",
  styleUrls: ["./updatepass.page.scss"],
})
export class UpdatepassPage implements OnInit {
  btnView = false;
  mobileNo;
  constructor(
    public router: Router,
    public ds: DataService,
    public http: HttpClient
  ) {}

  ngOnInit() {}

  checkMob(ev) {
    let mobNo=ev.target.value;
    if (mobNo.length == 10) {
      this.btnView = true;
      this.mobileNo = mobNo;
    } else {
      this.btnView = false;
    }
  }

  otpPage(f: NgForm) {
    // console.log(this.mobileNo);
    // console.log(f.valid);
    this.http
      .post(`${this.ds.serverUrl}check_mobile_no`, { mob: this.mobileNo })
      .subscribe(
        (res) => {
         // console.log(res);
          if (res != 1) {
            alert("Enter registered mobile number");
            // alert("Mobile number should be unique");
          } else {
           // console.log(res);
            this.router.navigate([`get-otp/${this.mobileNo}`]);
          }
        },
        (err) => console.log(err)
      );
  }
}
