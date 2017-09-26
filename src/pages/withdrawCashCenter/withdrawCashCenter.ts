import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WithdrawCashRecordPage } from '../withdrawCashRecord/withdrawCashRecord';

import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { PAGE_SIZE,APP_PIC_URL} from "../../providers/Constants";
@Component({
  selector: 'page-withdrawCashCenter',
  templateUrl: 'withdrawCashCenter.html'
})
export class WithdrawCashCenterPage{

    styles:any=["stylePre","stylePre","stylePre","stylePre","stylePre","stylePre"];
    pre_styleNo:number=0;//需要去掉选中样式的下标
 

     showScroll:boolean=true;
      pageNo: number;
      items:any=null;
      amount:number=0;//查询金额
       imgUrl:string=APP_PIC_URL;
    constructor(
        public navCtrl: NavController,
          public httpService: HttpService,
        public nativeService:NativeService
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){
       this.pageNo = 1;
        this.showScroll = true;
        this.select(0,1000);

    }
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
  
   select(index,value){
        this.pageNo = 1;
        this.showScroll = true;
         this.pre_styleNo=index;
         this.amount=value;
         this.findPayees();
   }
  
     //提现jilu
   gotoWithdrawCashRecordPage(){
    
    this.navCtrl.push(WithdrawCashRecordPage);
   }

   //查询da款人列表
    findPayees(){

        var paramMap = {
                        pageNumber:this.pageNo,
                        pageSize:PAGE_SIZE,
                        bankName:'',
                        amount:this.amount
                };
        this.httpService.get('/withdrawCash/findPays',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.items=respData.data;
                    let leng=this.items.length;
                          if(leng==respData.page.totalCount){
                              this.showScroll=false;
                          }
                }else{
                  this.nativeService.alert(respData.message);
                }
                
            });
   
    }

      // 分页
    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
             var paramMap = {
                        pageNumber:this.pageNo,//页数
                        pageSize:PAGE_SIZE,//显示条数
                         bankName:'',
                         amount:this.amount
                    };
               this.httpService.get('/withdrawCash/findPays',paramMap).subscribe((respData:any)=>{
                   infiniteScroll.complete();
                    if(respData.code=='0000'){
                            let tdata = respData.data;
                            for(var o in tdata){
                                this.items.push(tdata[o]);
                            }
                          let leng=this.items.length;
                          if(leng==respData.page.totalCount){
                              this.showScroll=false;
                          }
                        }else{
                          this.nativeService.alert(respData.message);
                        }
                       
                });
               
        },500);

    }
}
