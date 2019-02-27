package host.exp.exponent;

import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;

import com.facebook.react.ReactPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import abi24_0_0.com.facebook.react.modules.core.PermissionAwareActivity;
import abi24_0_0.com.facebook.react.modules.core.PermissionListener;
import expo.core.interfaces.Package;
import host.exp.exponent.generated.DetachBuildConstants;
import host.exp.exponent.experience.DetachActivity;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends DetachActivity implements PermissionAwareActivity {

  private PermissionListener mPermissionListener;
  private ValueCallback<Uri> uploadMessage;
  private ValueCallback<Uri[]> uploadMessageAboveL;
  private final static int FILE_CHOOSER_RESULT_CODE = 10000;


  @Override
  public String publishedUrl() {
    return "exp://exp.host/@bonnytech/Bonny-badminton";
  }

  @Override
  public String developmentUrl() {
    return DetachBuildConstants.DEVELOPMENT_URL;
  }

  @Override
  public List<String> sdkVersions() {
    return new ArrayList<>(Arrays.asList("30.0.0"));
  }

  @Override
  public List<ReactPackage> reactPackages() {
    return ((MainApplication) getApplication()).getPackages();
  }

  @Override
  public List<Package> expoPackages() {
    // Here you can add your own packages.
    return super.expoPackages();
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public Bundle initialProps(Bundle expBundle) {
    // Add extra initialProps here
    return expBundle;
  }

  @Override
  public int checkPermission(String permission, int pid, int uid) {
    return PackageManager.PERMISSION_GRANTED;
  }

  @Override
  public  int checkSelfPermission(String permission) {
    return PackageManager.PERMISSION_GRANTED;
  }

  @Override
  public void requestPermissions(String[] permissions, int requestCode, PermissionListener listener) {
    mPermissionListener = listener;
    ActivityCompat.requestPermissions(this, permissions, requestCode);
  }


  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    // callback to native module
    mPermissionListener.onRequestPermissionsResult(requestCode, permissions, grantResults);
  }


  @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);

            WebView webview = (WebView) findViewById(R.id.web_view);
            assert webview != null;
            WebSettings settings = webview.getSettings();
            settings.setUseWideViewPort(true);
            settings.setLoadWithOverviewMode(true);
            settings.setJavaScriptEnabled(true);
            webview.setWebChromeClient(new WebChromeClient() {

                // For Android < 3.0
                public void openFileChooser(ValueCallback<Uri> valueCallback) {
                    uploadMessage = valueCallback;
                    openImageChooserActivity();
                }

                // For Android  >= 3.0
                public void openFileChooser(ValueCallback valueCallback, String acceptType) {
                    uploadMessage = valueCallback;
                    openImageChooserActivity();
                }

                //For Android  >= 4.1
                public void openFileChooser(ValueCallback<Uri> valueCallback, String acceptType, String capture) {
                    uploadMessage = valueCallback;
                    openImageChooserActivity();
                }

                // For Android >= 5.0
                @Override
                public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
                    uploadMessageAboveL = filePathCallback;
                    openImageChooserActivity();
                    return true;
                }
            });
            String targetUrl = "file:///android_asset/up.html";
            webview.loadUrl(targetUrl);
        }

        private void openImageChooserActivity() {
            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("image/*");
            startActivityForResult(Intent.createChooser(i, "Image Chooser"), FILE_CHOOSER_RESULT_CODE);
        }


        @Override
        protected void onActivityResult(int requestCode, int resultCode, Intent data) {
            super.onActivityResult(requestCode, resultCode, data);
            if (requestCode == FILE_CHOOSER_RESULT_CODE) {
                if (null == uploadMessage && null == uploadMessageAboveL) return;
                Uri result = data == null || resultCode != RESULT_OK ? null : data.getData();
                if (uploadMessageAboveL != null) {
                    onActivityResultAboveL(requestCode, resultCode, data);
                } else if (uploadMessage != null) {
                    uploadMessage.onReceiveValue(result);
                    uploadMessage = null;
                }
            }
        }

        @TargetApi(Build.VERSION_CODES.LOLLIPOP)
        private void onActivityResultAboveL(int requestCode, int resultCode, Intent intent) {
            if (requestCode != FILE_CHOOSER_RESULT_CODE || uploadMessageAboveL == null)
                return;
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK) {
                if (intent != null) {
                    String dataString = intent.getDataString();
                    ClipData clipData = intent.getClipData();
                    if (clipData != null) {
                        results = new Uri[clipData.getItemCount()];
                        for (int i = 0; i < clipData.getItemCount(); i++) {
                            ClipData.Item item = clipData.getItemAt(i);
                            results[i] = item.getUri();
                        }
                    }
                    if (dataString != null)
                        results = new Uri[]{Uri.parse(dataString)};
                }
            }
            uploadMessageAboveL.onReceiveValue(results);
            uploadMessageAboveL = null;
        }
}
