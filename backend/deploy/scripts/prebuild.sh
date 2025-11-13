echo "Removing temporary folders"
rm -rf prebuild
mkdir prebuild

echo "Installing deps"
npm install

echo "Preparing node_modules"
mv node_modules prebuild/node_modules

cd prebuild/node_modules
for i in * .??*
do
    echo "Archiving $i"
    tar czf "$i.tar.gz" "./$i"
    rm -rf "$i"
done
cd ../..

echo "Staging changes"
git add --all
git add --all -f prebuild/node_modules
