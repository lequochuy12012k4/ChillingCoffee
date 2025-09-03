import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helper/util';
import aqp from 'api-query-params';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { use } from 'passport';

@Injectable()
export class UsersService {

  constructor(@InjectModel(Users.name)
  private usersModel: Model<Users>,
  private  readonly mailService: MailerService,
  private readonly configService: ConfigService
  ) { }

  isEmailExist = async (email: string) => {
    const user = await this.usersModel.exists({ email });
    if (user) return true;
    return false;
  }
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException("Email already exists: " + email);
    }
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.usersModel.create({
      name, email, password: hashPassword, phone, address, image
    })
    return {
      _id: user._id
    }
    return 'This action adds a new user';
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.usersModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const result = await this.usersModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);
    return { result, totalPages };
  }

  async findById(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.usersModel.findById(id);
    } else {
      throw new BadRequestException("Id is not valid: " + id);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return this.usersModel.findOne({ email });
  }

  async findByResetToken(token: string) {
    return this.usersModel.findOne({ reset_password_token: token });
  }

  async findByActivationCode(code: string) {
    return this.usersModel.findOne({ code_id: code });
  }

  async activateAccount(userId: string) {
    return await this.usersModel.updateOne(
      { _id: userId },
      { 
        isActive: true,
        code_id: null,
        code_expired: null
      }
    );
  }

  async setResetToken(userId: string, token: string, expires: Date) {
    return this.usersModel.updateOne(
      { _id: userId },
      { reset_password_token: token, reset_password_expires: expires }
    );
  }

  async clearResetToken(userId: string) {
    return this.usersModel.updateOne(
      { _id: userId },
      { $unset: { reset_password_token: 1, reset_password_expires: 1 } }
    );
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashPassword = await hashPasswordHelper(newPassword);
    return this.usersModel.updateOne(
      { _id: userId },
      { password: hashPassword }
    );
  }

  async sendResetPasswordEmail(email: string, token: string) {
    try {
      let resetUrl;
      const clientUrl = this.configService.get<string>('CLIENT_URL');
      const serverUrl = this.configService.get<string>('SERVER_LINK');
      if(serverUrl===""){
        resetUrl = `${clientUrl}/reset-password?token=${encodeURIComponent(token)}`;
      }else{
        resetUrl = `${serverUrl}/reset-password?token=${encodeURIComponent(token)}`;
      }
      
      let mainUrl;
      if(serverUrl===""){
        mainUrl = clientUrl;
      }else{
        mainUrl = serverUrl;
      }

      const user = await this.findByEmail(email);
      const userName = user?.name || email;
      
      await this.mailService.sendMail({
        to: email,
        subject: 'Reset your ChillingCoffee password',
        template: 'reset-password',
        context: {
          mainUrl,
          resetUrl,
          name: userName,
        },
      });
      return resetUrl;
    } catch (error) {
      console.error('Error sending reset password email:', error);
      // Return the reset URL even if email fails, so the user can still reset their password
      const resetUrl = `${this.configService.get<string>('CLIENT_URL') || 'http://localhost:3000'}/reset-password?token=${encodeURIComponent(token)}`;
      return resetUrl;
    }
  }

  async createGoogleUser(googleUserData: { email: string; name: string; googleId?: string; image?: string }) {
    const { email, name, googleId, image } = googleUserData;
    
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    // Create new Google OAuth user
    const user = await this.usersModel.create({
      email,
      name,
      googleId,
      image,
      isActive: true, // Google users are automatically active
      accout_type: 'google',
      role: 'user'
    });

    return user;
  }

  async updateGoogleInfo(userId: string, googleInfo: { googleId?: string; image?: string }) {
    return await this.usersModel.updateOne(
      { _id: userId },
      { 
        googleId: googleInfo.googleId,
        image: googleInfo.image,
        accout_type: 'google'
      }
    );
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.usersModel.updateOne(
      { _id: updateUserDto._id }, { ...updateUserDto })
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.usersModel.deleteOne({ _id });
    } else {
      throw new BadRequestException("Id is not valid: " + _id);
    }
    return `This action removes a #${_id} user`;
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException("Email already exists: " + email);
    }
    const clientUrl = this.configService.get<string>('CLIENT_URL');
      const serverUrl = this.configService.get<string>('SERVER_LINK');
    let mainUrl;
      if(serverUrl===""){
        mainUrl = clientUrl;
      }else{
        mainUrl = serverUrl;
      }
    const hashPassword = await hashPasswordHelper(password);
    const code_id = uuidv4();
    const code_expired_value = this.configService.get<string>('CODE_EXPIRED');
    const code_expired_unit = this.configService.get<string>('CODE_EXPIRED_TIME_UNIT');
    const user = await this.usersModel.create({
      name, email, password: hashPassword,
      isActive : false,
      code_id: code_id,
      code_expired: dayjs().add(  
        parseInt(<any>code_expired_value, 10), // Parse to integer
        code_expired_unit as dayjs.ManipulateType // Cast to correct type
      )
    })

    this.mailService.sendMail({
      to: user.email, // list of receivers
      // from: 'noreply@nestjs.com', // sender address
      subject: 'Activate your account ChillingCoffee', // Subject line
      template : "register", // HTML body content
      context:{
        name: user?.name ?? user.email,
        activationCode: code_id,
        mainUrl
      }
    })
    
    return{
      _id : user._id,
    }
  }

  async createAdminUser() {
    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await this.findByEmail(adminEmail);
    
    if (existingAdmin) {
      return existingAdmin;
    }

    const hashPassword = await hashPasswordHelper('admin');
    const adminUser = await this.usersModel.create({
      name: 'Admin',
      email: adminEmail,
      password: hashPassword,
      isActive: true,
      role: 'admin',
      accout_type: 'local'
    });

    return adminUser;
  }
}
