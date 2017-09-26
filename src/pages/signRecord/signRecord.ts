import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { PAGE_SIZE,APP_PIC_URL} from "../../providers/Constants";
import { Utils} from "../../providers/Utils";


@Component({
  selector: 'page-signRecord',
  templateUrl: 'signRecord.html'
})
export class SignRecordPage{

    pageSize:number = PAGE_SIZE;//分页大小
    pageNumber:number;//分页页数
    recordInfo:any = [];//转账记录详情
    showScroll:boolean=true;
    currencyType:string;//记录类型 40
    imgUrl:string=APP_PIC_URL;
    constructor(
        public navCtrl: NavController,
        public nativeService:NativeService,
        public httpService: HttpService,
        public utils: Utils
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){
        this.pageNumber = 1;
        this.currencyType = '40';
        this.loadData();
    }

    //加载转账记录
    loadData(){
         this.pageNumber = 1;
        this.showScroll = true;
        this.httpService.get('/user/findBillRecord',{
            busnessType:"15",
            pageNumber:this.pageNumber,
            pageSize:this.pageSize,
            currencyType:this.currencyType
        }).subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.recordInfo = respData.data;
                if(this.recordInfo!=null){
                     let leng=this.recordInfo.length;
                    if(leng==respData.page.totalCount){
                        this.showScroll=false;
                    }
                }
            }else{
                this.nativeService.alert(respData.message);
            }
        });
    }

    doRefresh(refresher){
       
        this.httpService.get('/user/findBillRecord',{
             busnessType:"15",
            pageNumber:this.pageNumber,
            pageSize:this.pageSize,
            currencyType:this.currencyType
        }).subscribe((respData:any)=>{
            refresher.complete();
            if(respData.code=='0000'){
                this.recordInfo = respData.data;
                
            }else{
                this.nativeService.alert(respData.message);
            }
        },err=>{
            refresher.complete();
        });
    }

    doInfinite(infiniteScroll) {
        this.pageNumber++;
        setTimeout(() => {
            this.httpService.get('/user/findBillRecord',{
                pageNumber:this.pageNumber,
                pageSize:this.pageSize,
                currencyType:this.currencyType
            }).subscribe((respData:any)=>{
                infiniteScroll.complete();
                if(respData.code=='0000'){
                    let tdata = respData.data;
                   // this.showScroll =(eval(tdata).length==this.pageSize);
                    for(var o in tdata){
                        this.recordInfo.push(tdata[o]);
                    }
                     if(this.recordInfo!=null){
                             let leng=this.recordInfo.length;
                            if(leng==respData.page.totalCount){
                                this.showScroll=false;
                            }
                        }
                }else{
                    this.nativeService.alert(respData.message);
                }
            });
        }, 500);
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
}
