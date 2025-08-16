import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({timestamps: true})
export class Users {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password : string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  image: string;

  @Prop()
  accout_type : string;

  @Prop()
  role: string;

  @Prop()
  isActive: boolean;

  @Prop()
  code_id : string;

  @Prop()
  code_expired : Date;
}

export const UserSchema = SchemaFactory.createForClass(Users);
