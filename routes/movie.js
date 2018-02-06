const movieController = require("../controller/movie");
const router = require("koa-router")();

router.post("/api/movie/create", movieController.create);
router.post("/api/movie/delete", movieController.delete);
router.post("/api/movie/uploadimage", movieController.uploader, movieController.uploadImage, movieController.uploadImageNext);
router.post("/api/movie/getmovies", movieController.getMovies);

module.exports = router;