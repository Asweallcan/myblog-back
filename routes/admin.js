const router = require('koa-router')();
const AdminController = require("../controller/admin.js");

router.post('/api/admin/login', AdminController.login);
// router.post("/api/admin/initavatar", AdminController.initAvatar);
// router.post("/api/admin/uploadavatar", AdminController.uploader, AdminController.uploadAvatar, AdminController.uploadAvatarNext);
// router.post("/api/admin/cropavatar", AdminController.cropAvatar, AdminController.cropAvatarNext, AdminController.cropAvatarFinal);
module.exports = router;