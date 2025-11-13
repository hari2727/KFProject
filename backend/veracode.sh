npm run build
npm run configure dev

touch kfhub_tarc_svc_nest.tar.gz

tar --exclude=veracode-wrapper.jar --exclude=node_modules --exclude=__tests__ --exclude=dist --exclude=release --exclude=documentation --exclude=temp --exclude=coverage --exclude=.angular --exclude=last-build --exclude=.git --exclude=.idea --exclude=.DS_Store --exclude=.ssh --exclude=kfhub_tarc_svc_nest.tar.gz -zcf kfhub_tarc_svc_nest.tar.gz .

wget -q -O veracode-wrapper.jar https://repo1.maven.org/maven2/com/veracode/vosp/api/wrappers/vosp-api-wrappers-java/24.4.13.0/vosp-api-wrappers-java-24.4.13.0.jar

java -jar veracode-wrapper.jar -sandboxname manual-sandbox -createsandbox true -action UploadAndScan -createprofile true -autoscan true -appname "KFD-PMNGR-KFHUB-TARC-SVC-NEST" -version "ref-manual-$(date -u +%y%m%d-%H%M%S)" -filepath kfhub_tarc_svc_nest.tar.gz -vid 78133959f016adb2080afdc319b36220 -vkey 16c846b089b90584ef84b75061d5d511be31c4f705f511ea5f508c4c3636f3df77e5f364fc937a86e863abde1d2959244779c37a43deb75c25c2fa9b2934b036 -maxretrycount 10 -debug
