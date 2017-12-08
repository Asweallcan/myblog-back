const router = require('koa-router')();
const AdminController = require("../controller/admin.js");

router.post('/api/api/admin/login', AdminController.login);
router.post("/api/api/admin/initavatar",AdminController.initAvatar);
router.post("/api/api/admin/uploadavatar",AdminController.uploader,AdminController.uploadAvatar,AdminController.uploadAvatarNext);
router.post("/api/api/admin/cropavatar",AdminController.cropAvatar,AdminController.cropAvatarNext,AdminController.cropAvatarFinal);
module.exports = router;
