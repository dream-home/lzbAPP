import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/HttpService";
import {GlobalData} from "../../providers/GlobalData";


@Component({
  selector: 'page-addbank',
  templateUrl: 'addbank.html'
})
export class AddBankPage {

  addBankName:string = '';
  addBankTypeId:any;
  addBankCard:string= '';
  addBankBranch:any;
  addBankDefaultState:any;
  banks:any;
  userInfo:any;
   loadingButton:boolean = false; //登录按钮是否禁用
  constructor(public navCtrl: NavController,   public globalData: GlobalData, public nativeService:NativeService,private httpService:HttpService,navParams:NavParams) {

         
         
          this.userInfo = this.globalData.userInfo;
           this.addBankName =  this.userInfo.name;
     
  }

   /*页面事件*/
    ionViewWillEnter(){
          this.loadBank();
          this.loadingButton = false;
          this.httpService.get('/user/findUserInfo').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.userInfo = respData.data;
                this.globalData.userInfo = respData.data;
                this.addBankName =  this.userInfo.name;
            }else{
                this.nativeService.alert(respData.message);
            }
        });
       

    }



  //新增银行卡
  submitData(){

      if(this.addBankName.trim().length == 0){
            this.nativeService.showImgLoading("持卡人姓名长度必须2-20位字符",2); 
            return false;
      }

  		if(this.addBankName.trim().length<2 || (/^\d{2,20}$/.test(this.addBankName))){
            this.nativeService.showImgLoading("持卡人姓名长度必须为2-20位字符",2); 
            return false;
      }
      
      if(this.addBankCard.trim().length ==0 ){
            this.nativeService.showImgLoading("银行卡号不能为空",2);
            return false;
      }


      if(this.addBankCard.trim().length<10 || this.addBankCard.trim().length>22){
            this.nativeService.showImgLoading("银行卡号长度必须为10-22位字符",2);
            return false;
      }

     if((/[^\w\u4e00-\u9fa5]+/).test(this.addBankBranch)){
          this.nativeService.showImgLoading("开户支行不能为特殊字符",2);
          return false;
      }

       if((/[^\w\u4e00-\u9fa5]+/).test(this.addBankName)){
            this.nativeService.showImgLoading("持卡人姓名不能为特殊字符",2); 
            return false;
      }


      





      var bank  = {
           bankCard:this.addBankCard,
           bankTypeId:this.addBankTypeId,
           branch:this.addBankBranch,
           defaultState:this.addBankDefaultState == true?"10":"20",
           name:this.addBankName
      }
       this.loadingButton = true;
      console.log(bank.defaultState);

      this.httpService.post('/setting/bank/add',bank).subscribe((respData:any)=>{
          if(respData.code=='0000'){
               this.nativeService.showImgLoading("添加银行卡成功",1);
               this.navCtrl.pop();
               
          }else{
              this.nativeService.showImgLoading(respData.message,0);
          }
          this.loadingButton = false;
      });    
  }


  //获取银行卡列表
  loadBank(){

      this.httpService.get('/setting/bank/typeList').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.banks = respData.data;
            }else{
                this.nativeService.alert(respData.message);
            }
      });



  }






}
