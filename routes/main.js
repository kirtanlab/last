const express = require('express');
const router = express.Router();

const{getAuthor,getspecifics,getall} = require('../controllers/main');

router.route('/all').get(getall);
router.route('/author').get(getAuthor);
router.route('/specifics').get(getspecifics);

module.exports = router;