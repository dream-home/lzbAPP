import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from "@angular/http";
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AppVersion } from '@ionic-native/app-version';
import { Toast } from '@ionic-native/toast';
import {Network} from '@ionic-native/network';
import { AppMinimize } from '@ionic-native/app-minimize';

import { Http } from '@angular/http';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';

/*ionic3  Camera等设备必须先在module声明*/
import { CallNumber } from '@ionic-native/call-number';
import { Camera } from '@ionic-native/camera';
import { Clipboard } from '@ionic-native/clipboard';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { NativeService } from "../providers/NativeService";
import { HttpService } from "../providers/HttpService";
import { Utils } from "../providers/Utils";
import { GlobalData } from "../providers/GlobalData";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CollectMoneyPage } from '../pages/collectMoney/collectMoney';
import { TransferMoneyPage } from '../pages/transferMoney/transferMoney';
import { ShareFriendPage } from '../pages/shareFriend/shareFriend';
import { RechargeMoneyPage } from '../pages/rechargeMoney/rechargeMoney';
import { WithdrawCashPage } from '../pages/withdrawCash/withdrawCash';
import { DigitalAssetPage } from '../pages/digitalAsset/digitalAsset';
import { SetPage } from '../pages/set/set';
import { BankPage } from '../pages/bank/bank';
import { AddBankPage } from '../pages/addbank/addbank';
import { UpdateNickNamePage } from '../pages/updateNickName/updateNickName';
import { SelectPayerPage } from '../pages/selectPayer/selectPayer';
import { LoginPwdSettingPage } from '../pages/loginPwdSetting/loginPwdSetting';
import { PayPwdSettingPage } from '../pages/payPwdSetting/payPwdSetting';
import { AboutPage } from '../pages/about/about';
import { RegisterPage } from '../pages/register/register';
import { ForgetPwdPage } from '../pages/forgetPwd/forgetPwd';
import { DigitalRollOutPage } from '../pages/digitalRollOut/digitalRollOut';
import { DigitalExchangePage } from '../pages/digitalExchange/digitalExchange';
import { ForgetPayPwdPage } from '../pages/forgetPayPwd/forgetPayPwd';
import { FeedBackPage } from '../pages/feedBack/feedBack';
import { DigitalAssetRecordPage } from '../pages/digitalAssetRecord/digitalAssetRecord';
import { UnfinishOrderPage } from '../pages/unfinishOrder/unfinishOrder';
import { TransferRecordPage } from '../pages/transferRecord/transferRecord';
import { CollectionRecordPage } from '../pages/collectionRecord/collectionRecord';
import { VoucherCenterPage } from '../pages/voucherCenter/voucherCenter';
import { RechargeRecordPage } from '../pages/rechargeRecord/rechargeRecord';
import { CheckOrderPage } from '../pages/checkOrder/checkOrder';
import { RechargeOrderDetailPage } from '../pages/rechargeOrderDetail/rechargeOrderDetail';
import { UpdateBankPage } from '../pages/updatebank/updatebank';
import { TXunfinishOrderPage } from '../pages/TXunfinishOrder/TXunfinishOrder';
import { TXfinishOrderPage } from '../pages/TXfinishOrder/TXfinishOrder';
import { WithdrawCashOrderDetailPage } from '../pages/withdrawCashOrderDetail/withdrawCashOrderDetail';
import { WithdrawCashRecordPage } from '../pages/withdrawCashRecord/withdrawCashRecord';
import { WithdrawCashCenterPage } from '../pages/withdrawCashCenter/withdrawCashCenter';
import { WithdrawCashcheckPage } from '../pages/withdrawCashcheck/withdrawCashcheck';
import { ShareRecordPage } from '../pages/shareRecord/shareRecord';
import { WithdrawCashselectPayerPage } from '../pages/withdrawCashselectPayer/withdrawCashselectPayer';
import { FinishOrderPage } from '../pages/finishOrder/finishOrder';
import { SelectBankPage } from '../pages/selectBank/selectBank';
import { BalanceRecordPage } from '../pages/balanceRecord/balanceRecord';
import { SignRecordPage } from '../pages/signRecord/signRecord';

import { ScoreRecordPage } from '../pages/scoreRecord/scoreRecord';
import { TabsPage } from '../pages/tabs/tabs';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

const PAGES = [
    MyApp,
    HomePage,
    LoginPage,
    CollectMoneyPage,
    TransferMoneyPage,
    ShareFriendPage,
    RechargeMoneyPage,
    WithdrawCashPage,
    DigitalAssetPage,
    SetPage,
    BankPage,
    SelectPayerPage,
	  AddBankPage,
    UpdateNickNamePage,
    LoginPwdSettingPage,
    PayPwdSettingPage,
    AboutPage,
    RegisterPage,
    ForgetPwdPage,
    DigitalExchangePage,
    DigitalRollOutPage,
    ForgetPayPwdPage,
    FeedBackPage,
    DigitalAssetRecordPage,
    UnfinishOrderPage,
    TransferRecordPage,
    CollectionRecordPage,
    VoucherCenterPage,
    RechargeRecordPage,
    CheckOrderPage,
    RechargeOrderDetailPage,
    UpdateBankPage,
    TXunfinishOrderPage,
    WithdrawCashOrderDetailPage,
    WithdrawCashRecordPage,
    WithdrawCashCenterPage,
    WithdrawCashcheckPage,
    ShareRecordPage,
    WithdrawCashselectPayerPage,
    TXfinishOrderPage,
    FinishOrderPage,
    SelectBankPage,
    FinishOrderPage,
    BalanceRecordPage,
    SignRecordPage,
    ScoreRecordPage,
    TabsPage
];

@NgModule({
    declarations: [...PAGES],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp,{
            backButtonText: '',
            iconMode: 'ios',
            mode: 'ios',
            modalEnter: 'modal-slide-in',
            modalLeave: 'modal-slide-out',
            tabsPlacement: 'bottom',
            pageTransition: 'ios-transition',
            tabsHideOnSubPages: true
        }),
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [Http]
        })
    ],
    bootstrap: [IonicApp],
        entryComponents: [...PAGES],
    providers: [
        StatusBar,
        SplashScreen,
        AppVersion,
        AppMinimize,
        Toast,
        Network,
        NativeService,
        HttpService,
        Utils,
        Camera,
        CallNumber,
        Clipboard,
        GlobalData,
        BarcodeScanner,
        File,
        FileTransfer,
        PhotoLibrary,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
