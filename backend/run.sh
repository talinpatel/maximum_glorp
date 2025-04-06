#!/bin/sh
cd ..
npm run build
cd backend
flask run
