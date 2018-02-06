/*
 * @Author: lvshihao 
 * @Date: 2018-01-30 08:45:24 
 * @Last Modified by: lvshihao
 * @Last Modified time: 2018-02-01 20:27:52
 */
const router = require('koa-router')();
const AdminController = require("../controller/admin.js");

router.post('/api/admin/login', AdminController.login);
router.post('/api/admin/regist',AdminController.regist);
router.post("/api/admin/update",AdminController.update);
router.post("/api/admin/backgrounds",AdminController.backgrounds);
router.post("/api/admin/uploadimage",AdminController.uploader,AdminController.uploadImage,AdminController.uploadImageNext);
router.post("/api/admin/deleteimage",AdminController.deleteImage);
module.exports = router;

/*
 router.post("/api/admin/initavatar", AdminController.initAvatar);
 router.post("/api/admin/uploadavatar", AdminController.uploader, AdminController.uploadAvatar, AdminController.uploadAvatarNext);
 router.post("/api/admin/cropavatar", AdminController.cropAvatar, AdminController.cropAvatarNext, AdminController.cropAvatarFinal);
*/