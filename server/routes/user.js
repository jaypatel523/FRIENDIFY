const express = require('express');
const multer = require('multer');
const upload = multer({ dest: "uploads/" })
const authentication = require('../middleware/authentication')
const {
    create,
    userByID,
    read,
    list,
    remove,
    update,
    photo,
    defaultPhoto,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople,
    editProfile,
    getProfile,
    getAllUsersToFollow,
    getUserDetails,
    isFollowing,
    editUserProfile,
    searchUser
} = require('../controllers/user');
const {
    signin,
    signout,
    requireSignin,
    hasAuthorization
}
    = require('../controllers/auth');


const router = express.Router()

// my roues
router.route('/api/editprofile').post(upload.single('image'), editUserProfile);
router.route('/api/newuser').post(upload.single('image'), create)
router.route('/api/userstofollow/:userId').get(getAllUsersToFollow);
router.route('/api/getuserdetails/:userId').get(getUserDetails);
router.route('/api/users/follow').put(authentication, addFollowing, addFollower)
router.route('/api/users/unfollow').put(authentication, removeFollowing, removeFollower)
router.route('/api/user/isfollowing').post(authentication, isFollowing);
router.route('/api/searchuser/query').get(authentication, searchUser);








router.route('/api/profile/:userId').get(authentication, getProfile);
router.route('/api/editprofile').put(authentication, upload.single('profile'), editProfile);
router.route('/api/users/photo/:userId').get(photo, defaultPhoto)
router.route('/api/users/defaultphoto').get(defaultPhoto)
router.route('/api/users/findpeople/:userId').get(requireSignin, findPeople)
router.route('/api/users/:userId')
    .get(requireSignin, read)
    .put(requireSignin, hasAuthorization, update)
    .delete(requireSignin, hasAuthorization, remove)
router.param('userId', userByID)

module.exports = router
