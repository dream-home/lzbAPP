import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/HttpService";
import { Utils } from "../../providers/Utils";
import {PAGE_SIZE} from "../../providers/Constants";
@Component({
  selector: 'page-digitalAssetRecord',
  templateUrl: 'digitalAssetRecord.html'
})

export class DigitalAssetRecordPage{
   
    pet:any="out";
    url:any="";//请求地址
    showScroll:boolean=true;
    pageNo: number;
    items:any=[];
   
   
    constructor(
        public navCtrl: NavController,
         public httpService: HttpService,
        public nativeService:NativeService,
        public utils:Utils
    ){
        this.pageNo = 1;
        this.showScroll = true;
    }

    /*页面事件*/
    ionViewWillEnter(){
      this.select(1);


    }
   

 	/*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
    select(index){
        if(index==1){//转出
            this.url="/coin/loadTransRecords";
        }
        if(index==2){//兑换
            this.url="/coin/loadExchangeRecords";
        }
        this.items=[];
        this.loadData();
    }

    //加载数据
    loadData(){
        this.pageNo = 1;
        this.showScroll = true;
        var paramMap = {
                pageNumber:this.pageNo,//页数
                pageSize:PAGE_SIZE//显示条数
            };
       this.httpService.get(this.url,paramMap).subscribe((respData:any)=>{
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
        console.log("------------------>>>>>>>>jinlaile");
        this.pageNo++;
        setTimeout(() => {
             var paramMap = {
                        pageNumber:this.pageNo,//页数
                        pageSize:PAGE_SIZE//显示条数
                    };
               this.httpService.get(this.url,paramMap).subscribe((respData:any)=>{
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