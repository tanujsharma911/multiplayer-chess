import mongoose from "mongoose";
declare const userSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    rating: number;
    avatar?: string | null;
    refreshToken?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    rating: number;
    avatar?: string | null;
    refreshToken?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    name: string;
    email: string;
    rating: number;
    avatar?: string | null;
    refreshToken?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        name: string;
        email: string;
        rating: number;
        avatar?: string | null;
        refreshToken?: string | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        name: string;
        email: string;
        rating: number;
        avatar?: string | null;
        refreshToken?: string | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    name: string;
    email: string;
    rating: number;
    avatar?: string | null;
    refreshToken?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
interface UserMethods {
    generateAccessToken(): string;
    generateRefreshToken(): string;
}
export type UserModel = mongoose.Model<mongoose.InferSchemaType<typeof userSchema>> & UserMethods;
export declare const User: UserModel;
export {};
//# sourceMappingURL=user.model.d.ts.map