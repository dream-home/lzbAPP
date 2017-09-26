import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AddBankPage } from '../addbank/addbank';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/HttpService";
import { APP_PIC_URL } from "../../providers/Constants";
import {GlobalData} from "../../providers/GlobalData";
@Component({
  selector: 'page-selectBank',
  templateUrl: 'selectBank.html'
})
export class SelectBankPage {
  banks:any;
  imageUrl:string;
  userInfo:any;
  constructor(public navCtrl: NavController,  public globalData: GlobalData,public nativeService:NativeService,private httpService:HttpService) {
  		
  		this.imageUrl = APP_PIC_URL;
  		this.userInfo = this.globalData.userInfo;	
  }


  /*页面事件*/
    ionViewWillEnter(){
        this.loadBank();
    }


  /*添加银行卡*/
  addBank(){

  		this.navCtrl.push(AddBankPage);

  }

  
  /*获取银行卡列表*/
  loadBank(){
  		 this.httpService.get('/setting/bank/findAll').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.banks = respData.data;
            }else{
                this.nativeService.alert(respData.message);
            }
      });



  }

  /*选择银行卡*/
  selectBank(bank){
     this.globalData._bank=bank;
     this.goToBackPage();
  }

   /*返回上一页*/
    goToBackPage(){

        this.navCtrl.pop();
    }

}
