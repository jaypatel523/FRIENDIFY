const User = require('../models/user');
const extend = require('lodash/extend');
const errorHandler = require('../error/errorHandler');
const formidable = require('formidable');
const fs = require('fs');
const mongoose = require('mongoose');

const create = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const profilePicURL = req.file.path;


        const dbusername = await User.findOne({ username });
        if (dbusername) {
            throw new Error("please choose other username.")
        }


        const dbemail = await User.findOne({ email });
        if (dbemail) {
            throw new Error('user already registered');
        }


        const user = new User({ username, email, password, profilePicURL });
        await user.save();
        res.send({ user: user, message: 'created account successfully' })

    } catch (error) {
        if (error.name === "ValidationError") {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.send(errors);
        }
        res.send({ message: error.message });
    }
}


const editUserProfile = async (req, res) => {
    try {

        const profilePicURL = req.file?.path;
        let user;
        if (!profilePicURL) {
            user = await User.findOneAndUpdate({ _id: req.body.userId }, {
                username: req.body.username,
                email: req.body.email,
            })
            await user.save();
        }
        else {
            user = await User.findOneAndUpdate({ _id: req.body.userId }, {
                username: req.body.username,
                email: req.body.email,
                profilePicURL
            })
            await user.save();
        }

        res.json(user);

    } catch (error) {
        if (error.name === "ValidationError") {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.send(errors);
        }
        res.send({ message: error.message });
    }
}


const getUserDetails = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId }).select('-hashed_password -salt')
        res.json({ user });
    } catch (err) {
        res.json({ error: errorHandler.getErrorMessage(err) })
    }
}


const searchUser = async (req, res) => {
    try {
        console.log(req.query);
        const query = req.query.username;
        const userId = req.query.userId;

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: mongoose.Types.ObjectId(userId) }, // Exclude the user itself
                    followers: { $ne: mongoose.Types.ObjectId(userId) } // Exclude the user's followers
                }
            },
            {
                $match: {
                    $or: [
                        { username: { $regex: query, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    profilePicURL: 1
                }
            }
        ]);

        // const users = await User.aggregate([
        //     {
        //         $match: {
        //             $or: [
        //                 { username: { $regex: query, $options: 'i' } }
        //             ]
        //         }
        //     },
        //     {
        //         $addFields: {
        //             isCurrentUser: {
        //                 $eq: ['$_id', mongoose.Types.ObjectId(userId)]
        //             },
        //             isFollowed: {
        //                 $in: [mongoose.Types.ObjectId(userId), '$followers']
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             username: 1,
        //             profilePicURL: 1,
        //             isCurrentUser: 1,
        //             isFollowed: 1
        //         }
        //     }
        // ]);
        // const users = await User.aggregate([
        //     {
        //         $match: {
        //             $or: [
        //                 { username: { $regex: query, $options: 'i' } }
        //             ]
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             username: 1,
        //             profilePicURL: 1,
        //             isCurrentUser: {
        //                 $eq: ['$_id', userId]
        //             },
        //             isFollowed: {
        //                 $in: [mongoose.Types.ObjectId(userId), '$followers']
        //             }
        //         }
        //     }
        // ]);

        res.json(users);

    } catch (error) {
        res.send(error.message);
    }
}


const getAllUsersToFollow = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });
        const following = user.following.map((id) => id.toString());
        const usersToFollow = await User.find({ _id: { $ne: req.params.userId, $nin: following } })
        res.send({ users: usersToFollow });
    }
    catch (error) {
        res.send(error.message);
    }
}




const addFollowing = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } })
        next()
    } catch (err) {
        res.json({ error: errorHandler.getErrorMessage(err) })
    }
}

const addFollower = async (req, res) => {
    try {
        let result = await User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json({ result })
    } catch (err) {
        res.json({ error: errorHandler.getErrorMessage(err) })
    }
}


const removeFollowing = async (req, res, next) => {
    try {

        await User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } })
        next()
    } catch (err) {
        return res.json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


const removeFollower = async (req, res) => {
    try {
        let result = await User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    } catch (err) {
        return res.json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


const isFollowing = async (req, res) => {
    try {

        let result = await User.findOne({ _id: req.body.userId, following: req.body.followId });
        if (!result) {
            return res.json({ success: false })
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ error: error.message })
    }

}















const editProfile = async (req, res) => {
    try {

        const profileURL = req.file.path;
        const { username, name, userId, bio } = req.body;

        let user = await User.findById(userId);
        user.username = username;
        user.profileName = name;
        user.bio = bio.split('.');
        user.profilePicURL = profileURL;

        await user.save();
        res.send({ message: 'successfullt edited !', editedUser: user });

    } catch (error) {
        res.send({ message: "can't edit your profile now. Please try again after sometime..." })
    }
}



const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        const userProfile = await User.findById(userId);
        if (!userProfile) {
            throw new Error('user not found');
        }
        res.send({ userProfile });

    } catch (error) {
        res.send({ message: "someting went wrong" })
    }
}


/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id).populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}

const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created')
        res.json(users)
    } catch (err) {
        return res.json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.json({
                error: "Photo could not be uploaded"
            })
        }
        let user = req.profile
        user = extend(user, fields)
        user.updated = Date.now()
        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
        }
        try {
            await user.save()
            user.hashed_password = undefined
            user.salt = undefined
            res.json(user)
        } catch (err) {
            return res.json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

const remove = async (req, res) => {
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const photo = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next()
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + profileImage)
}


const findPeople = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)
    try {
        let users = await User.find({ _id: { $nin: following } }).select('name')
        res.json(users)
    } catch (err) {
        return res.json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

module.exports = {
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
}