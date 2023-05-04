const { Thought, User } = require("../models");

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({}).populate({
            path: "reactions",
            select: "__v,"
        })
        .select("-__v") 
        .sort({ _id: -1 })
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    getThoughtById({ parms }, res) {
        Thought.findOne({ _id: parms.id })
        .populate({
            path: "reactions",
            select: "__v,",
        })
        .select("-__v")
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(400).json({ message: "No thought with this id!"});
        }
        res.json(dbThoughtData);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
},

createThought({ parms, body }, res) {
    Thought.create( body)
    .then(({ _id}) => {
        return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: _id } },
            { new: true }
        );
    })
    .then((dbUserData) => {
        if (!dbUserData) {
            return res.status(404).json({ message: "Thought created but no user with this id!"});
        }
        res.json({ message: "Thought successfully created!"});
    })
    .catch((err) => res.json(err));
},

updateThought({ parms, body }, res) {
    Thought.findOneAndUpdate({ _id: parms.id}, body, {
        new: true,
        runValidators: true,
    })
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
         res.status(404).json({ message: "No Thought found with this id!"});
         return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) => res.json(err));
},

deleteThought({ parms }, res) {
    Thought.findOneAndDelete({ _id: parms.id})
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
            return res.status(404).json({ message: "No thought with this id!" });
        }
        return User.findOneAndUpdate(
            { thoughts: parms.id },
            { $pull: { thoughts: parms.id } },
            { new: true }
        );
    })
    .then((dbUserData) => {
        if (!dbUserData) {
            return res.status(404).json({ message: "Thought created but no user with this id!"});
        }
        res.json({ message: "Thought successfully deleted!"});
    })
    .catch((err) => res.json(err));
},

addReaction({ parms, body }, res) {
    Thought.findOneAndUpdate(
        { _id: parms.thoughtid}, 
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
    )
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
         res.status(404).json({ message: "No Thought  with this id!"});
         return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) => res.json(err));
},

removeReaction({ parms }, res) {
    Thought.findOneAndUpdate(
        { _id: parms.thoughtid},
        { $pull: { reactions: { reactionid: parms.reactionid } } },
        { new: true }
    )
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => res.json(err));
    },
};

module.exports = thoughtController;