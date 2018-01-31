#!/bin/bash -v

# lib
uglifyjs -c -m -o lib/alipush.js.min -- lib/alipush.js
mv -f lib/alipush.js.min lib/alipush.js
uglifyjs -c -m -o lib/alipush.spec.js.min -- lib/alipush.spec.js
mv -f lib/alipush.spec.js.min lib/alipush.spec.js
uglifyjs -c -m -o lib/app_helper.js.min -- lib/app_helper.js
mv -f lib/app_helper.js.min lib/app_helper.js
uglifyjs -c -m -o lib/autoloader.js.min -- lib/autoloader.js
mv -f lib/autoloader.js.min lib/autoloader.js
uglifyjs -c -m -o lib/cms.js.min -- lib/cms.js
mv -f lib/cms.js.min lib/cms.js
uglifyjs -c -m -o lib/cms.spec.js.min -- lib/cms.spec.js
mv -f lib/cms.spec.js.min lib/cms.spec.js
uglifyjs -c -m -o lib/errors.js.min -- lib/errors.js
mv -f lib/errors.js.min lib/errors.js
uglifyjs -c -m -o lib/export_xlsx.js.min -- lib/export_xlsx.js
mv -f lib/export_xlsx.js.min lib/export_xlsx.js
uglifyjs -c -m -o lib/handlebars_helper.js.min -- lib/handlebars_helper.js
mv -f lib/handlebars_helper.js.min lib/handlebars_helper.js
uglifyjs -c -m -o lib/juhe.js.min -- lib/juhe.js
mv -f lib/juhe.js.min lib/juhe.js
uglifyjs -c -m -o lib/juhe.spec.js.min -- lib/juhe.spec.js
mv -f lib/juhe.spec.js.min lib/juhe.spec.js
uglifyjs -c -m -o lib/logging.js.min -- lib/logging.js
mv -f lib/logging.js.min lib/logging.js
uglifyjs -c -m -o lib/mailer.js.min -- lib/mailer.js
mv -f lib/mailer.js.min lib/mailer.js
uglifyjs -c -m -o lib/qrcode.js.min -- lib/qrcode.js
mv -f lib/qrcode.js.min lib/qrcode.js
uglifyjs -c -m -o lib/socket_helper.js.min -- lib/socket_helper.js
mv -f lib/socket_helper.js.min lib/socket_helper.js
uglifyjs -c -m -o lib/wxservice.js.min -- lib/wxservice.js
mv -f lib/wxservice.js.min lib/wxservice.js
uglifyjs -c -m -o lib/wxsettings.js.min -- lib/wxsettings.js
mv -f lib/wxsettings.js.min lib/wxsettings.js
uglifyjs -c -m -o lib/xlsx.js.min -- lib/xlsx.js
mv -f lib/xlsx.js.min lib/xlsx.js
uglifyjs -c -m -o lib/xlsx.spec.js.min -- lib/xlsx.spec.js
mv -f lib/xlsx.spec.js.min lib/xlsx.spec.js

# routers
uglifyjs -c -m -o routers/auth.js.min -- routers/auth.js
mv -f routers/auth.js.min routers/auth.js
uglifyjs -c -m -o routers/badge.js.min -- routers/badge.js
mv -f routers/badge.js.min routers/badge.js
uglifyjs -c -m -o routers/building.js.min -- routers/building.js
mv -f routers/building.js.min routers/building.js
uglifyjs -c -m -o routers/cms-contents.js.min -- routers/cms-contents.js
mv -f routers/cms-contents.js.min routers/cms-contents.js
uglifyjs -c -m -o routers/ecard.js.min -- routers/ecard.js
mv -f routers/ecard.js.min routers/ecard.js
uglifyjs -c -m -o routers/employee.js.min -- routers/employee.js
mv -f routers/employee.js.min routers/employee.js
uglifyjs -c -m -o routers/message.js.min -- routers/message.js
mv -f routers/message.js.min routers/message.js
uglifyjs -c -m -o routers/parking.js.min -- routers/parking.js
mv -f routers/parking.js.min routers/parking.js
uglifyjs -c -m -o routers/staff-auth.js.min -- routers/staff-auth.js
mv -f routers/staff-auth.js.min routers/staff-auth.js
uglifyjs -c -m -o routers/staff-badge.js.min -- routers/staff-badge.js
mv -f routers/staff-badge.js.min routers/staff-badge.js
uglifyjs -c -m -o routers/staff-upload.js.min -- routers/staff-upload.js
mv -f routers/staff-upload.js.min routers/staff-upload.js
uglifyjs -c -m -o routers/ticket.js.min -- routers/ticket.js
mv -f routers/ticket.js.min routers/ticket.js
uglifyjs -c -m -o routers/upload.js.min -- routers/upload.js
mv -f routers/upload.js.min routers/upload.js
uglifyjs -c -m -o routers/meter.js.min -- routers/meter.js
mv -f routers/meter.js.min routers/meter.js
uglifyjs -c -m -o routers/wxpay.js.min -- routers/wxpay.js
mv -f routers/wxpay.js.min routers/wxpay.js

# controllers
uglifyjs -c -m -o controllers/acl.js.min -- controllers/acl.js
mv controllers/acl.js.min controllers/acl.js
uglifyjs -c -m -o controllers/crud-admin.js.min -- controllers/crud-admin.js
mv controllers/crud-admin.js.min controllers/crud-admin.js
uglifyjs -c -m -o controllers/crud-building.js.min -- controllers/crud-building.js
mv controllers/crud-building.js.min controllers/crud-building.js
uglifyjs -c -m -o controllers/crud-company.js.min -- controllers/crud-company.js
mv controllers/crud-company.js.min controllers/crud-company.js
uglifyjs -c -m -o controllers/crud-message.js.min -- controllers/crud-message.js
mv controllers/crud-message.js.min controllers/crud-message.js
uglifyjs -c -m -o controllers/crud-ticket.js.min -- controllers/crud-ticket.js
mv controllers/crud-ticket.js.min controllers/crud-ticket.js
uglifyjs -c -m -o controllers/crud-ticket_template.js.min -- controllers/crud-ticket_template.js
mv controllers/crud-ticket_template.js.min controllers/crud-ticket_template.js
uglifyjs -c -m -o controllers/crud-user.js.min -- controllers/crud-user.js
mv controllers/crud-user.js.min controllers/crud-user.js
uglifyjs -c -m -o controllers/dashboard.js.min -- controllers/dashboard.js
mv controllers/dashboard.js.min controllers/dashboard.js
uglifyjs -c -m -o controllers/user.js.min -- controllers/user.js
mv controllers/user.js.min controllers/user.js
uglifyjs -c -m -o controllers/utils.js.min -- controllers/utils.js
mv controllers/utils.js.min controllers/utils.js
