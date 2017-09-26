import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AddBankPage } from '../addbank/addbank';
import { UpdateBankPage } from '../updatebank/updatebank';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/HttpService";
import { APP_PIC_URL } from "../../providers/Constants";
import {GlobalData} from "../../providers/GlobalData";
@Component({
  selector: 'page-bank',
  templateUrl: 'bank.html'
})
export class BankPage {
  banks:any;
  imageUrl:string;
  userInfo:any;
  constructor(public navCtrl: NavController,  public globalData: GlobalData,private alertCtrl: AlertController,public nativeService:NativeService,private httpService:HttpService) {
  		
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

  /*删除银行卡*/
  delBank(event,id){	
      //阻止事件冒泡
  		event.stopPropagation();
  		let alert = this.alertCtrl.create({
	    title: '您确定删除该银行卡？',
	    message: '',
	    buttons: [
	      {
	        text: '取消',
	        role: '取消',
	        handler: () => {
	          console.log('Cancel clicked');
	        }
	      },
	      {
	        text: '确定',
	        handler: () => {
	          this.httpService.post('/setting/bank/del',[{"id":id}]).subscribe((respData:any)=>{
		          if(respData.code=='0000'){
		               this.nativeService.showImgLoading("删除银行卡成功",1);
		               this.loadBank();
		          }else{
		              this.nativeService.showImgLoading(respData.message,0);
		          }
		      });    
	        }
	      }
	    ]
	  });
	  alert.present();



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

  /*修改银行卡*/
  updateBank(bank){
      
      this.navCtrl.push(UpdateBankPage,{"banks":bank});


  }





}
