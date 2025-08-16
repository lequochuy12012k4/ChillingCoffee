import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantsDocument = HydratedDocument<Restaurants>;

@Schema()
export class Restaurants {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  rating: number;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurants);
