import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/HttpService";
import { Utils } from "../../providers/Utils";
import {PAGE_SIZE} from "../../providers/Constants";
import { WithdrawCashOrderDetailPage } from '../withdrawCashOrderDetail/withdrawCashOrderDetail';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-withdrawCashcheck',
  templateUrl: 'withdrawCashcheck.html'
})

export class WithdrawCashcheckPage{
    queryType:any=30;//查询类型
    pageNo: number;//页数
    showScroll:boolean=true;
    items:any=null;
    constructor(
       public navCtrl: NavController,
        public nativeService:NativeService,
         public httpService: HttpService,
        private alertCtrl: AlertController,
        public utils:Utils
    ){
         this.pageNo = 1;
        this.showScroll = true;
    }
 
    /*页面事件*/
    ionViewWillEnter(){
      this.loadData();

    }
   
//加载数据
    loadData(){
        this.pageNo = 1;
        this.showScroll = true;
        var paramMap = {
                pageNumber:this.pageNo,//页数
                pageSize:PAGE_SIZE,//显示条数
                queryType:this.queryType//订单类型，10未选择收款人，20已选择收款人
            };
       this.httpService.get('/withdrawCash/findOrder',paramMap).subscribe((respData:any)=>{
              if(respData.code=='0000'){
                    this.items=respData.data;//
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
                queryType:this.queryType//订单类型，10未选择收款人，20已选择收款人
            };
               this.httpService.get('/withdrawCash/findOrder',paramMap).subscribe((respData:any)=>{
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
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //订单详情
    gotoWithdrawCashOrderDetailPage(orderid){
        this.navCtrl.push(WithdrawCashOrderDetailPage,{"id":orderid});
    }

     //确认收款

      //确认shou款
  confirm(event,id,i){  
      //阻止事件冒泡
      event.stopPropagation();
      let alert = this.alertCtrl.create({
      title: '您要确认收款？一经操作无法更改，请谨慎处理',
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
           this.confirmTransaction(id,i);
          }
        }
      ]
    });
    alert.present();



  }
    confirmTransaction(thisid,i){

      var paramMap = {
                        id:thisid
                };
        this.httpService.post('/withdrawCash/confirmTransaction',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.nativeService.showImgLoading("确认收款成功","1");
                     if(this.items!=null){
                        if(this.items.length>i){
                          this.items[i].transactionState=50;
                        }
                     }
                }else{
                  this.nativeService.alert(respData.message);
                }
                
            });
    }


 
    
}
