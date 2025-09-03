import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ReviewsDocument = HydratedDocument<Reviews>;

@Schema({ timestamps: true })
export class Reviews {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItems', required: false })
    menuItem?: mongoose.Schema.Types.ObjectId;

    @Prop()
    productText?: string;

    @Prop()
    rating: number;

    @Prop()
    image: string; // stored URL

    @Prop()
    comment: string;

    @Prop()
    created_at : Date;
}

export const ReviewsSchema = SchemaFactory.createForClass(Reviews);


