## Installation

```sh
npm install
```

Now you can run your local server:
```sh
npm start
```
Server is located at http://localhost:3000

## Build
```sh
npm run build;
rsync -avz  build/ test:/home/zhaolei/yida-property/public/
```
服务器2
```sh
rm -rf build/; npm run build; rsync -avz build/ yidalize_no2:/root/yida-lize-property/public/
rm -rf build/; npm run build; rsync -avz build/ yidalize_no2:/usr/share/nginx/html/yida-lize-applications/
```
