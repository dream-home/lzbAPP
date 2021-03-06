import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/HttpService";
import { Utils } from "../../providers/Utils";

import { PAGE_SIZE,APP_PIC_URL} from "../../providers/Constants";

@Component({
  selector: 'page-rechargeRecord',
  templateUrl: 'rechargeRecord.html'
})
export class RechargeRecordPage{

    pageNo: number;//页数
    showScroll:boolean=true;
    items:any=null;
     imgUrl:string=APP_PIC_URL;
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
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
  //加载数据
    loadData(){
        this.pageNo = 1;
        this.showScroll = true;
        var paramMap = {
                pageNumber:this.pageNo,//页数
                pageSize:PAGE_SIZE//显示条数
            };
       this.httpService.get('/recharge/findRecords',paramMap).subscribe((respData:any)=>{
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
                pageSize:PAGE_SIZE//显示条数
            };
               this.httpService.get('/recharge/findRecords',paramMap).subscribe((respData:any)=>{
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
