import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Restaurants } from 'src/modules/restaurants/schemas/restaurant.schema';

export type LikesDocument = HydratedDocument<Likes>;

@Schema({ timestamps: true })
export class Likes {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurants.name })
  restaurant: mongoose.Schema.Types.ObjectId;

}

export const LikeSchema = SchemaFactory.createForClass(Likes);
