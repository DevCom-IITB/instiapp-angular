#!/bin/bash
if [ "$CIRCLE_BRANCH" = "master" ]; then

git config --global user.name "Xunk-Bot"
git config --global user.email "xunk@radialapps.com"
git config --global push.default matching
git clone git@github.com:go-xunk/iitb-app-deploy.git deploy

cd deploy
rm -r *
cp -R ../dist/* ./
date > BUILD_TIME
for i in ../patch/*.patch; do patch < $i; done
git add -A
git commit -m "Automated Build"
git push
cd ..

else

echo "Not on master branch"

fi