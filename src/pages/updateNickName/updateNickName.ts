import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/HttpService";
import {GlobalData} from "../../providers/GlobalData";

@Component({
  selector: 'page-updateNickName',
  templateUrl: 'updateNickName.html'
})
export class UpdateNickNamePage {
  nickNames:any = '';
  constructor(public navCtrl: NavController, public globalData: GlobalData, public nativeService:NativeService,public httpService: HttpService,) {

    this.nickNames = this.globalData.userInfo.nickName;

  }



  submitData(){

      if(this.nickNames.trim().length==0){
         this.nativeService.showImgLoading("昵称输入有误",2);
        return;
      }
       if((/[^\w\u4e00-\u9fa5]+/).test(this.nickNames.trim())){
            this.nativeService.showImgLoading("昵称不能为特殊字符",2);
            return false;
        }



  		var nickNa = {
  			nickName:this.nickNames

  		}	
  		this.httpService.post('/setting/user/upNickName',nickNa).subscribe((respData:any)=>{
            if(respData.code=='0000'){
                 this.nativeService.showImgLoading("修改成功",1);
                 this.navCtrl.pop();
                 
            }else{
                this.nativeService.showImgLoading(respData.message,0);
            }
        });    

  		//this.nativeService.showToast("test");

  }





}
