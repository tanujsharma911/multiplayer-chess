import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const gameSchema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    moves: {
        type: [
            {
                after: { type: String, required: true },
                before: { type: String, required: true },
                color: { type: String, required: true },
                from: { type: String, required: true },
                to: { type: String, required: true },
                lan: { type: String, required: true },
                san: { type: String, required: true },
                piece: { type: String, required: true },
            },
        ],
        required: true,
    },
    result: {
        type: String,
        enum: ["w", "b", "draw", null],
        default: null,
    },
    startedAt: {
        type: Date,
        required: true,
    },
    chats: {
        type: [
            {
                message: { type: String, required: true },
                time: { type: Date, required: true },
                from: { type: String, required: true },
            },
        ],
        default: [],
    },
    reason: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
gameSchema.plugin(mongooseAggregatePaginate);
export const Game = mongoose.model("Game", gameSchema);
//# sourceMappingURL=game.model.js.map