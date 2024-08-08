const {
	addBanner,
	deleteBanner,
	editBanner,
	getAllBanners,
} = require('../../controllers/ManagerControllers/BannerController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');
const { uploadBanner } = require('../../utils/uploadFiles/uploadDestinations');

router.use(isAuth);

router.post('/',  uploadBanner.single('image'), addBanner);

router.put('/:banner_id',  uploadBanner.single('image'), editBanner);

router.delete('/', deleteBanner);

router.get('/', getAllBanners);

module.exports = router;