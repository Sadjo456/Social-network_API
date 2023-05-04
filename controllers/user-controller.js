const { User, Thought } = require("../models");

const UserController = {
    getAllUser(req, res)  {
        User.find({})
        .populate({
            path: "friends",
            select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1})
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(400);
        });
    
    },

getUserById({ parms }, res) {
    User.findOne({ _id: parms.id })
    .populate({
        path: "thought",
        select: "-__v",
    })
    .populate({
        path: "friends",
        select: "-__v",
    })
    .select("-__v")
    .then((dbUserData) => {
        if (!dbUserData) {
            return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    createUser({ body }, res) {
        User.create(body)
         .then((dbUserData) => res.json(dbUserData))
         .catch((err) => res.json(err));
    },

    updateUser({ parms, body }, res) {
        User.findOneAndUpdate({ _id: parms.id }, body, {
            new: true,
            runValidators: true,
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id!" });
                return;
            }
            res.json(dbUserData);
            })
            .catch((err) => res.json(err));
        },

        deleteUser({ parms }, res) {
            User.findOneAndDelete({ _id: parms.id })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: "No user  with this id!" });
            }

            return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
        })
        .then(() => {
            res.json({ message: "User and associated thoughts deleted!" });
        })
        .catch((err) => res.json(err));
    },

    addFriend({ parms }, res) {
        User.findOneAndUpdate(
            { _id: parms.userId },
            { $addToSet: { friends: parms.friendId } },
            { new: true, runValidators: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user with this id!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },

    removeFriend({ parms }, res) {
        User.findOneAndUpdate(
            { _id: parms.userId },
            { $pull: { friends: parms.friendId } },
            { new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "No user with this id!" });
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },
};

module.exports = UserController;

    
