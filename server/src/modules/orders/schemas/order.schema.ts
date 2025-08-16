import { Users } from 'src/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurants } from 'src/modules/restaurants/schemas/restaurant.schema';

export type OrdersDocument = HydratedDocument<Orders>;

@Schema({ timestamps: true })
export class Orders {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Users.name })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurants.name })
    restaurant: mongoose.Schema.Types.ObjectId;

    @Prop()
    total_price: string;

    @Prop()
    status: string;

    @Prop()
    order_time: Date;

    @Prop()
    delivery_time: Date;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);