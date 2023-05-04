const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateformat");

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },

        reactionBady: {
            type: String,
            required: true,
            maxlength: 200,
        },

        username: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => dateFormat(timestamp),
        },

     },
     {
        toJSON: {
            getters: true,
            },
            id: false,
    }

);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 200,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => dateFormat(timestamp),
        },

        username: {
            type: String,
            required: true,
        },

        reactions: [ReactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
}
);

const Thought = model("Thought", ThoughtSchema);

module.exporta = Thought;
    