import { AlertController } from "@ionic/angular";
import { DataService } from "./../Services/data.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: "app-verifyuser",
  templateUrl: "./verifyuser.page.html",
  styleUrls: ["./verifyuser.page.scss"],
})
export class VerifyuserPage implements OnInit {
  otp;
  storeOtp: any;

  mobile: number;
  status = false;
  validMobile = false;
  hideResendBtn = true;

  regUserData: any;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public ds: DataService,
    public altCtrl: AlertController
  ) {
    activatedRoute.queryParams.subscribe(async (params) => {
      if (router.getCurrentNavigation().extras.state.regData) {
        this.regUserData = await router.getCurrentNavigation().extras.state
          .regData;
        console.log(this.regUserData);

        this.http
          .get(
            `${this.ds.serverUrl}send_reguser_otp?mob=${this.regUserData.mob}`
          )
          .subscribe((data) => {
            console.log(data);
            this.storeOtp = data;
            console.log(this.regUserData);
          });
      }
    });
  }

  ngOnInit() { }

  resend() {
    this.http
      .get(`${this.ds.serverUrl}send_reguser_otp?mob=${this.regUserData.mob}`)
      .subscribe((data) => {
        this.storeOtp = data;
        console.log(this.storeOtp);
      });
  }

  resendOTP() {
    this.hideResendBtn = false;
    setTimeout(() => {
      this.resend();
      this.hideResendBtn = true;
    }, 20000);
  }

  onKeyUP(event) {
     let ev=event.target.value;
    if (ev.length > 4) {
      this.status = true;
      return;
    }

    if (ev == this.storeOtp) {
      this.status = false;
      this.mobile = ev;
      this.validMobile = true;
      console.log(ev);
      return;
    } else {
      this.validMobile = false;
      return;
    }
  }

  verify() {
    if (this.validMobile) {
      console.log(this.regUserData);
      this.http
        .post(`${this.ds.serverUrl}register_user_api`, this.regUserData)
        .subscribe((response) => {
          // this.ds.showAlert();
          console.log(response);
          this.accConfirmation();
        });
    }
  }

  async accConfirmation() {
    const alert = await this.altCtrl.create({
      cssClass: "regSuccessAlert",

      message: `<div class="success-checkmark">
            <div class="check-icon">
              <span class="icon-line line-tip"></span>
              <span class="icon-line line-long"></span>
              <div class="icon-circle"></div>
              <div class="icon-fix"></div>
            </div>
          </div>
          <center style="margin-left: -20%">
          <strong style = 'font-size:larger;' >
          Success
          </strong> <br>
          <span style="font-size: small"> 
          Congratulation, your account has been created successfully.
          </span>
          </center>
`,
      mode: "ios",
      animated: true,
      backdropDismiss: false,
      buttons: [
        {
          text: "Continue",
          handler: () => {
            console.log("Confirm Okay");
            this.router.navigate(["home"]);
          },
        },
      ],
    });

    await alert.present();
  }
}
