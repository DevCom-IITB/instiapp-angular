#!/bin/bash
mkdir -p deploy
cd deploy
rm -rf *
cp -R ../dist/* ./
date > BUILD_TIME
for i in ../patch/*.patch; do patch < $i; done
echo "Patched in deploy"
