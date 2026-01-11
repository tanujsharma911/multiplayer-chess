import mongoose from "mongoose";
import { Game } from "../models/game.model.js";
export const fetchUserGames = async (req, res) => {
    const userId = req.user?.userId;
    console.log("Fetching games for userId:", userId);
    if (!userId) {
        return res.status(400).json({
            code: 400,
            status: "error",
            message: "Bad Request :: Missing user ID",
        });
    }
    const games = await Game.aggregate([
        {
            $match: {
                $or: [
                    { player1: new mongoose.Types.ObjectId(userId) },
                    { player2: new mongoose.Types.ObjectId(userId) },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "player1",
                foreignField: "_id",
                as: "player1",
            },
        },
        { $unwind: "$player1" },
        {
            $lookup: {
                from: "users",
                localField: "player2",
                foreignField: "_id",
                as: "player2",
            },
        },
        { $unwind: "$player2" },
        {
            $project: {
                _id: 1,
                chats: 1,
                createdAt: 1,
                moves: 1,
                reason: 1,
                result: 1,
                startedAt: 1,
                player1: {
                    avatar: 1,
                    email: 1,
                    name: 1,
                    rating: 1,
                    _id: 1,
                },
                player2: {
                    avatar: 1,
                    email: 1,
                    name: 1,
                    rating: 1,
                    _id: 1,
                },
            },
        },
        {
            $sort: { startedAt: -1 },
        },
    ]);
    res.status(200).json({ code: 200, status: "success", games });
};
export const fetchGameById = async (req, res) => {
    const gameId = req.query.gameId;
    if (!gameId) {
        return res.status(400).json({
            code: 400,
            status: "error",
            message: "Bad Request :: Missing game ID",
        });
    }
    const game = await Game.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(gameId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "player1",
                foreignField: "_id",
                as: "player1",
            },
        },
        { $unwind: "$player1" },
        {
            $lookup: {
                from: "users",
                localField: "player2",
                foreignField: "_id",
                as: "player2",
            },
        },
        { $unwind: "$player2" },
        {
            $project: {
                _id: 1,
                chats: 1,
                createdAt: 1,
                moves: 1,
                reason: 1,
                result: 1,
                startedAt: 1,
                player1: {
                    avatar: 1,
                    email: 1,
                    name: 1,
                    rating: 1,
                    _id: 1,
                },
                player2: {
                    avatar: 1,
                    email: 1,
                    name: 1,
                    rating: 1,
                    _id: 1,
                },
            },
        },
    ]);
    res.status(200).json({ code: 200, status: "success", game: game[0] });
};
//# sourceMappingURL=game.controller.js.map