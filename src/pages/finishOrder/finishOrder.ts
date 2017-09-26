import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/HttpService";
import { Utils } from "../../providers/Utils";
import {PAGE_SIZE} from "../../providers/Constants";
import { RechargeOrderDetailPage } from '../rechargeOrderDetail/rechargeOrderDetail';



@Component({
  selector: 'page-finishOrder',
  templateUrl: 'finishOrder.html'
})


export class FinishOrderPage{
   queryType:any=40;//查询类型
    pageNo: number;//页数
    showScroll:boolean=true;
    items:any=null;
    constructor(
       public navCtrl: NavController,
        public nativeService:NativeService,
         public httpService: HttpService,
     
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
       this.httpService.get('/recharge/findOrder',paramMap).subscribe((respData:any)=>{
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
               this.httpService.get('/recharge/findOrder',paramMap).subscribe((respData:any)=>{
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
    gotoRechargeOrderDetailPage(orderid){
        this.navCtrl.push(RechargeOrderDetailPage,{"id":orderid});
    }

}
