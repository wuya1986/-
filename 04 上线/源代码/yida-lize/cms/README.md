
pm2 start bin/www -n my-nodercms


rsync -avz --delete --exclude node_modules/ --exclude .git --exclude public/assets --exclude public/media --exclude logs  /works/projects/yida/cms/ yidalize_no2:/root/yida-lize-cms/ && 
ssh yidalize_no2 'pm2 restart 3'
