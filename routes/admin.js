/*
 * @Author: lvshihao 
 * @Date: 2018-01-30 08:45:24 
 * @Last Modified by: lvshihao
 * @Last Modified time: 2018-01-31 21:12:46
 */
const router = require('koa-router')();
const AdminController = require("../controller/admin.js");

router.post('/api/admin/login', AdminController.login);
router.post('/api/admin/regist',AdminController.regist);
router.post("/api/admin/update",AdminController.update);
module.exports = router;

/*
 router.post("/api/admin/initavatar", AdminController.initAvatar);
 router.post("/api/admin/uploadavatar", AdminController.uploader, AdminController.uploadAvatar, AdminController.uploadAvatarNext);
 router.post("/api/admin/cropavatar", AdminController.cropAvatar, AdminController.cropAvatarNext, AdminController.cropAvatarFinal);
*/