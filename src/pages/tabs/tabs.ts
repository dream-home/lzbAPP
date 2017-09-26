import { Component,ViewChild  } from '@angular/core';

import { HomePage } from '../home/home';
import { SetPage } from '../set/set';
import { DigitalAssetPage } from '../digitalAsset/digitalAsset';
import {GlobalData} from "../../providers/GlobalData";
import { HttpService } from "../../providers/HttpService";
import { Tabs } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";


@Component({
	selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
   @ViewChild('mainTabs') tabs:Tabs; 	
  tab1Root = DigitalAssetPage;
  tab2Root = null;
  tab3Root = null;

  constructor( public nativeService:NativeService,public globalData: GlobalData,public httpService: HttpService,) {
  	
  }


   /*页面事件*/
    ionViewWillEnter(){     
         this.httpService.get('/user/findUserInfo').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.globalData.userInfo = respData.data;
            }else{
              
            }
        });
    }


    show(){
    	
   		this.tab2Root = (this.globalData.Page2 == "1"? HomePage:null);
  		this.tab3Root = (this.globalData.Page3 == "1"? SetPage:null);
  		if(this.globalData.Page3 == null){
  			this.nativeService.showToast("数据正在加载中...");
  		}
  		
    	console.log(this.tab2Root);
    	
    }
}
