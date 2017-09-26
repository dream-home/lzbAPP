import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/HttpService";
import {GlobalData} from "../../providers/GlobalData";


@Component({
  selector: 'page-updatebank',
  templateUrl: 'updatebank.html'
})
export class UpdateBankPage {

  addBankName:any;
  addBankTypeId:any;
  addBankCard:any;
  addBankBranch:any;
  addBankDefaultState:any;
  banks:any;
  userInfo:any;
  constructor(public navCtrl: NavController,   public globalData: GlobalData, public nativeService:NativeService,private httpService:HttpService,private navParams:NavParams) {

        
         
           console.log(this.navParams.get('banks'));
           this.userInfo = this.globalData.userInfo;
           this.addBankName =  this.userInfo.name;
          
           this.addBankCard = this.navParams.get('banks').bankCard;
           this.addBankBranch = this.navParams.get('banks').branch;
           this.addBankTypeId = this.navParams.get('banks').bankTypeId;
           if(this.navParams.get('banks').defaultState == '10'){
               /*document.getElementById("defaultStatu") = true;  */
               this.addBankDefaultState = true;
           }else{
               this.addBankDefaultState = false;
           }
          

     
  }

   /*页面事件*/
    ionViewWillEnter(){
          this.loadBank();
       

    }



  //修改银行卡
  submitData(){

  		if(this.addBankName.trim().length<2 || (/^\d{2,15}$/.test(this.addBankName))){
            this.nativeService.showImgLoading("持卡人姓名长度必须2-15位字符",2); 
            return false;
      }
      if(!(/^\d{1,20}$/.test(this.addBankCard))){
            this.nativeService.showImgLoading("银行卡号只能输入数字",2); 
            return false;
      }





      var bank  = {
           id:this.navParams.get('banks').id,
           bankCard:this.addBankCard,
           bankTypeId:this.addBankTypeId,
           branch:this.addBankBranch,
           defaultState:this.addBankDefaultState == true?"10":"20",
           name:this.addBankName
      }


      this.httpService.post('/setting/bank/update',bank).subscribe((respData:any)=>{
          if(respData.code=='0000'){
               this.nativeService.showImgLoading("修改银行卡成功",1);
               this.navCtrl.pop();
               
          }else{
              this.nativeService.showImgLoading(respData.message,0);
          }
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
