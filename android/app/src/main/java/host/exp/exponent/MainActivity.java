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

public class MainActivity extends DetachActivity implements PermissionAwareActivity {

  private PermissionListener mPermissionListener;

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
}
