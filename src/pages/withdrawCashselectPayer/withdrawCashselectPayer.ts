import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { Utils } from "../../providers/Utils";
import { PAGE_SIZE,APP_PIC_URL} from "../../providers/Constants"; 
import { AlertController } from 'ionic-angular';
import { WithdrawCashRecordPage } from '../withdrawCashRecord/withdrawCashRecord';
@Component({
  selector: 'page-withdrawCashselectPayer',
  templateUrl: 'withdrawCashselectPayer.html'
})
export class WithdrawCashselectPayerPage{

   /* menuflag:any="triangle_up";*///点击匹配金额旁的红色小三角，默认隐藏，即向上
   /* tabflag:any="tabdiv";*///金额选项木块默认隐藏
    id:any="";//当前订单主键编号
    showScroll:boolean=true;
    pageNo: number;
    items:any=null;
    amount:number=0;//查询金额
    bankName:any="";//收款银行
    imgUrl:string=APP_PIC_URL;
    constructor(
        public navCtrl: NavController,
         public httpService: HttpService,
        public nativeService:NativeService,
        public navParams:NavParams,
        private alertCtrl: AlertController,
        public utils:Utils
    ){
        
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.id=this.navParams.get("id");
        this.amount=this.navParams.get("amount");
        this.bankName=this.navParams.get("bankName");
        this.findPays();

    }
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
    //点击匹配金额旁的红色小三角，默认隐藏，即向上
   /* showMune(){
        if(this.menuflag=="triangle_up"){
            this.menuflag="triangle_down";
            this.tabflag="tabdiv_show";
        }else{
            this.menuflag="triangle_up";
            this.tabflag="tabdiv_hide";
        }
    }*/
    gotoWithdrawCashRecordPage(){
      this.navCtrl.push(WithdrawCashRecordPage);
    }

    //查询da款人列表
    findPays(){
       this.pageNo = 1;
        this.showScroll = true;
        var paramMap = {
                        pageNumber:this.pageNo,
                        pageSize:PAGE_SIZE,
                        bankName:this.bankName,
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
        //console.log("------------------>>>>>>>>jinlaile");
        this.pageNo++;
        setTimeout(() => {
             var paramMap = {
                        pageNumber:this.pageNo,//页数
                        pageSize:PAGE_SIZE,//显示条数
                         bankName:this.bankName,
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


  /*匹配*/
  selectUser(nickName,amount,thisid){    
      //阻止事件冒泡
        /*event.stopPropagation();*/
        let alert = this.alertCtrl.create({
        title: '您确定匹配['+nickName+']的'+parseFloat(amount)+'元充值订单吗？',
        message: '',
        buttons: [
          {
            text: '取消',
            role: '取消',
            handler: () => {
              //console.log('Cancel clicked');
            }
          },
          {
            text: '确定',
            handler: () => {
                  this.seleuser(thisid);
            }
          }
        ]
      });
      alert.present();
  }


  seleuser(selectId){
             var paramMap = {
                        id:this.id,
                        selectId:selectId
                };
              this.httpService.post('/withdrawCash/selectUser',paramMap).subscribe((respData:any)=>{
                  if(respData.code=='0000'){
                       this.nativeService.showImgLoading("订单匹配成功",1);
                        setTimeout(() => {
                             this.goToBackPage();
                        },1000);
                  }else{
                      this.nativeService.showImgLoading(respData.message,0);
                       this.findPays();
                  }
              });    
  }
}
