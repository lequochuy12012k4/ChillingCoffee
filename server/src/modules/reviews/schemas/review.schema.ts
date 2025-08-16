import { Users } from 'src/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurants } from 'src/modules/restaurants/schemas/restaurant.schema';

export type ReviewsDocument = HydratedDocument<Reviews>;

@Schema({ timestamps: true })
export class Reviews {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Users.name })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurants.name })
    restaurant: mongoose.Schema.Types.ObjectId;

    @Prop()
    rating: number;

    @Prop()
    image: string;

    @Prop()
    comment: string;

    @Prop()
    created_at : Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Reviews);