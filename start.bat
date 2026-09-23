@echo off
echo Starting CodeLearn...
echo Starting Next.js on port 3000...
cd apps\web
start "Next.js" cmd /k "node_modules\bin\next dev -p 3000"
cd ..\api
echo Starting NestJS on port 3001...
start "NestJS" cmd /k "node_modules\bin\nest start --watch"
echo Both servers started!
echo Web: http://localhost:3000
echo API: http://localhost:3001
