const {
	editStaticContent,
	deleteStaticContent,
	getAllStaticContents,
	getStaticContentDependingOnTitle,
} = require('../../controllers/ManagerControllers/StaticContentController');
const router = require('express').Router();
const isAuth = require('../../utils/auth/jwtMiddleware');

router.use(isAuth);

router.put('/:static_content_id', editStaticContent);

router.delete('/:static_content_id', deleteStaticContent);

router.get('/', getAllStaticContents);

router.get('/title', getStaticContentDependingOnTitle);

module.exports = router;