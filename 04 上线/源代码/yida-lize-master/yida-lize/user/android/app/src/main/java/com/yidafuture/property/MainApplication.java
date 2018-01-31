package com.yidafuture.yidaproperty;

import android.app.Application;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactApplication;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import org.wonday.aliyun.push.AliyunPushPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;

import org.wonday.aliyun.push.AliyunPushPackage;

import com.alibaba.sdk.android.push.CloudPushService;
import com.alibaba.sdk.android.push.CommonCallback;
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;
import com.alibaba.sdk.android.push.register.HuaWeiRegister;
import com.alibaba.sdk.android.push.register.MiPushRegister;
import com.theweflex.react.WeChatPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new ReactNativeConfigPackage(),
                    new ImageResizerPackage(),
                    new ImagePickerPackage(),
                    new RNFSPackage(),
                    new AliyunPushPackage(),
                    new RNDeviceInfo(),
                    new VectorIconsPackage(),
                    new RCTCapturePackage(),
                    new SvgPackage(),
                    new SplashScreenReactPackage(),
                    new WeChatPackage(),
                    new CodePush(BuildConfig.code_push_android, MainApplication.this, BuildConfig.DEBUG)

            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);

        this.initCloudChannel();
    }

    /**
     * Init the Aliyun Push
     */
    private void initCloudChannel() {
        PushServiceFactory.init(this.getApplicationContext());
        CloudPushService pushService = PushServiceFactory.getCloudPushService();
        pushService.setNotificationSmallIcon(R.mipmap.ic_launcher);//设置通知栏小图标， 需要自行添加
        pushService.register(this.getApplicationContext(), "24739283", "89cb14f2a1b49d69047f09cf83a4f5c7", new CommonCallback() {
            @Override
            public void onSuccess(String responnse) {
                // success
            }
            @Override
            public void onFailed(String code, String message) {
                // failed
            }
        });

        // 注册方法会自动判断是否支持小米系统推送，如不支持会跳过注册。
        // MiPushRegister.register(this.getApplicationContext(), "小米AppID", "小米AppKey");
        // 注册方法会自动判断是否支持华为系统推送，如不支持会跳过注册。
        // HuaWeiRegister.register(this.getApplicationContext());
    }
}
