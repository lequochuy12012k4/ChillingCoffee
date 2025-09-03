import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MenuItemDocument = HydratedDocument<MenuItems>;

@Schema({ timestamps: true })
export class MenuItems {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    base_price: string;

    @Prop()
    image: string; // absolute or relative URL served by /uploads

    @Prop({ enum: ['drink', 'cake'], required: true })
    category: 'drink' | 'cake';
}

export const MenuItemsSchema = SchemaFactory.createForClass(MenuItems);


