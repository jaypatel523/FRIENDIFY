const Post = require('../models/post');
const User = require('../models/user');
const getErrorMessage = require('../error/errorHandler');
const formidable = require('formidable');
const fs = require('fs');


const create = async (req, res) => {
    try {
        const caption = req.body.caption;
        const imageUrl = req.file.path;

        if (!caption || !imageUrl) {
            throw new Error('please enter proper details')
        }

        let post = new Post({ text: caption, imageUrl: imageUrl });
        post.postedBy = req.profile;


        let result = await post.save();
        res.send({ result, message: 'post uploaded', success: true });
    } catch (error) {
        res.send({ message: error.message, success: false })
    }
}

const getAllPost = async (req, res) => {
    try {
        const more = parseInt(req.query.limit);
        const userId = req.query.userId.toString();

        const user = await User.findOne({ _id: userId }).select('following');
        let following = user.following.map((id) => id.toString());
        following.push(userId);

        const posts = await Post.find({ postedBy: following }).sort({ 'created': -1 }).populate('postedBy', '_id username profilePicURL').limit(more);
        res.send(posts);

    } catch (error) {
        res.send(error.message);
    }
}


const getAllPostOfUser = async (req, res) => {
    try {
        let posts = await Post.find({ postedBy: req.params.userId }).sort({ 'created': -1 }).populate('postedBy', '_id username profilePicURL');
        res.send(posts);
    } catch (error) {
        res.send(error.message);
    }
}



const getFollowerAndFollowing = async (req, res) => {

    try {
        let user = await User.findOne({ _id: req.params.userId }).populate('followers following', '_id username profilePicURL')
        res.send({ followers: user.followers, following: user.following })
    } catch (error) {
        res.json({ message: error.message })
    }
}





const like = async (req, res) => {
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.body.userId } }, { new: true })
        res.send({ result, message: "You just liked the post" })
    } catch (error) {
        res.send(error);
    }
}


const unlike = async (req, res) => {
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true })
        res.send({ result, message: "You just disliked the post" })
    } catch (error) {
        res.send(error.message);
    }
}


const getLikedPost = async (req, res) => {
    try {
        const likedPost = await Post.find({ likes: req.params.userId }).populate('postedBy', '_id username profilePicURL')
        res.send({ likedPost })
    } catch (error) {
        res.send(error.message);
    }
}


const isLiked = async (req, res) => {
    try {
        let result = await Post.findOne({ _id: req.params.postId, likes: req.params.userId });

        if (result) {
            return res.json({ success: true });
        }
        res.send({ success: false });

    } catch (error) {
        res.send(error.message);
    }
}

const comment = async (req, res) => {
    try {
        let comment = { text: req.body.comment, commentedBy: req.body.userId };
        let result = await Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true }).populate('comments.commentedBy', '_id username').exec();
        res.send({ result, message: "You just commented the post" });
    } catch (error) {
        res.send(error.message);
    }
}



const uncomment = async (req, res) => {
    try {
        let result = await Post.findOneAndUpdate({ _id: req.body.postId }, { $pull: { comments: { _id: req.body.commentId } } }, { new: true }).populate('comments.commentedBy', '_id username').exec();
        res.send({ result, message: "You just deleted comment from the post" });
    } catch (error) {
        res.send(error.message);
    }
}


const getAllComments = async (req, res) => {
    try {
        let result = await Post.find({ _id: req.params.postId }).populate('comments.commentedBy', '_id username').exec();
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
}



const savePost = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        user.savePosts.push(req.params.postId);

        await user.save();
        res.json({ user, success: true, message: "You just saved the post" })

    } catch (error) {
        res.send(error.message);
    }
}


const unsavePost = async (req, res) => {
    try {
        let user = await User.findByIdAndUpdate(req.params.userId, { $pull: { savePosts: req.params.postId } }, { new: true })
        res.send({ user, success: true, message: "You just unsaved the post" })
    }
    catch (error) {
        res.send(error.message);
    }
}



const getSavedPost = async (req, res) => {
    try {
        const savePosts = await User.findOne({ _id: req.params.userId }).select('-hashed_password -salt').populate({
            path: 'savePosts',
            select: '_id text imageUrl liked comments postedBy created',
            populate: {
                path: 'postedBy',
                select: '_id username profilePicURL',
            },
        })

        res.json(savePosts)
    } catch (error) {
        res.send(error.message);
    }
}


const isSaved = async (req, res) => {
    try {
        const post = await User.findOne({ _id: req.params.userId, savePosts: req.params.postId });
        if (post) {
            return res.send({ success: true })
        }
        res.send({ success: false });
    }
    catch (error) {
        res.send(error.message);
    }
}


const getLikesAndComments = async (req, res) => {
    try {
        const likesAndComments = await Post.findOne({ _id: req.params.postId }).select('likes comments');
        res.send({ likesAndComments });

    } catch (error) {
        res.send(error.message)
    }
}








const postByID = async (req, res, next, id) => {
    try {
        let post = await Post.findById(id).populate('postedBy', '_id name').exec()
        if (!post)
            return res.status('400').json({
                error: "Post not found"
            })
        req.post = post
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve use post"
        })
    }
}


const listByUser = async (req, res) => {
    try {
        let posts = await Post.find({ postedBy: req.profile._id })
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec()
        res.json(posts)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


const listNewsFeed = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)
    try {
        let posts = await Post.find({ postedBy: { $in: req.profile.following } })
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec()
        res.json(posts)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}



const remove = async (req, res) => {
    let post = req.post
    try {
        let deletedPost = await post.remove()
        res.json(deletedPost)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data)
}


const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if (!isPoster) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}



module.exports = {
    listByUser,
    listNewsFeed,
    create,
    postByID,
    remove,
    photo,
    like,
    unlike,
    comment,
    uncomment,
    isPoster,
    getAllPost,
    getAllPostOfUser,
    getAllComments,
    isLiked,
    savePost,
    unsavePost,
    isSaved,
    getSavedPost,
    getLikedPost,
    getFollowerAndFollowing,
    getLikesAndComments
}
