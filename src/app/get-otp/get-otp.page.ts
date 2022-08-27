import { DataService } from "./../Services/data.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-get-otp",
  templateUrl: "./get-otp.page.html",
  styleUrls: ["./get-otp.page.scss"],
})
export class GetOTPPage implements OnInit {
  storeOtp: any;
  btnView = false;
  otp;
  mob;
  hideResendBtn = true;

  t1: string;
  t2: string;
  t3: string;
  t4: string;
  t5: string;
  t6: string;

  constructor(
    public router: Router,
    public http: HttpClient,
    public ds: DataService,
    public activatedRoute: ActivatedRoute
  ) {
    //console.log(activatedRoute.snapshot.params.mob);
    this.mob = activatedRoute.snapshot.params.mob;
    this.resend();
  }

  ngOnInit() {}

  resend() {
   // return;
    this.http
      .get(`${this.ds.serverUrl}forgot_password_otp?mob=${this.mob}`)
      .subscribe((data) => {
        this.storeOtp = data;
        document.getElementById("snackbar_error").textContent="OTP sent succesfully";
      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); 
    }, 3000);
       // console.log(this.storeOtp);
      });
  }

  // get each otp
  moveFocus(event, nextElement, previousElement) {
    if (event.keyCode === 8 && previousElement) {
      previousElement.setFocus();
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else if (event.keyCode >= 96 && event.keyCode <= 105) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else {
      event.path[0].value = "";
    }
  }

  resendOTP() {
    this.hideResendBtn = false;
    setTimeout(() => {
      this.resend();
      this.hideResendBtn = true;
    }, 10000);
  }

  checkOTP(OTP) {
    if (OTP.length == 4) {
      this.btnView = true;
      this.otp = OTP;
    } else {
      this.btnView = false;
    }
  }

  verify() {
    if (
      this.t1 == undefined ||
      this.t2 == undefined ||
      this.t3 == undefined ||
      this.t4 == undefined
    ) {
      return;
    }
    this.otp = this.t1.concat(this.t2, this.t3, this.t4);
    //console.log(this.otp);
    //console.log(this.storeOtp);

    if (this.otp == this.storeOtp) {
      this.router.navigate([`changemob/${this.mob}`]);
     // console.log(true);
    } else {
      alert("Invalid OTP ");
    }
  }
}
