import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurants } from 'src/modules/restaurants/schemas/restaurant.schema';

export type MenusDocument = HydratedDocument<Menus>;

@Schema({ timestamps: true })
export class Menus {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurants.name })
    restaurant: mongoose.Schema.Types.ObjectId;
    
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    image: string;
}

export const UserSchema = SchemaFactory.createForClass(Menus);
