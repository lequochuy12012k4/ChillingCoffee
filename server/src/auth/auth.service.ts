
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helper/util';
import { UsersService } from 'src/modules/users/users.service';
import { CreateAuthDto, ForgotPasswordDto, ResetPasswordDto } from './dto/create-auth.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException("Email or password is incorrect");
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, name: user.name, sub: user._id, role: user.role };
    const response = {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
    console.log('Login response:', response); // Debug log
    return response;
  }

  async googleAuth(googleAuthDto: GoogleAuthDto) {
    const { email, name, googleId, image } = googleAuthDto;
    
    // Check if user exists
    let user = await this.usersService.findByEmail(email);
    
    if (!user) {
      // Create new user for Google OAuth
      user = await this.usersService.createGoogleUser({
        email,
        name,
        googleId,
        image,
      });
    } else {
      // Update existing user's Google information
      await this.usersService.updateGoogleInfo(user._id.toString(), { googleId, image });
    }

    // Ensure user exists before proceeding
    if (!user) {
      throw new BadRequestException('Failed to create or retrieve user');
    }

    // Generate JWT token
    const payload = { email: user.email, name: user.name, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    };
  }

  handleRegister = async (resgisterDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(resgisterDto);
  }

  async activateAccount(code: string) {
    const user = await this.usersService.findByActivationCode(code);
    
    if (!user) {
      throw new BadRequestException('Invalid activation code');
    }

    if (user.isActive) {
      throw new BadRequestException('Account is already activated');
    }

    if (dayjs().isAfter(dayjs(user.code_expired))) {
      throw new BadRequestException('Activation code has expired');
    }

    // Activate the account
    await this.usersService.activateAccount(user._id.toString());
    
    return {
      message: 'Account activated successfully',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const user = await this.usersService.findByEmail(dto.email);
      if (!user) {
        // avoid user enumeration
        return { message: 'If the email exists, a reset link has been sent.' };
      }

      const token = this.jwtService.sign({ sub: user._id, email: user.email }, { expiresIn: '1h' });
      const expires = dayjs().add(1, 'hour').toDate();
      await this.usersService.setResetToken(user._id.toString(), token, expires);
      const resetUrl = await this.usersService.sendResetPasswordEmail(user.email, token);
      return { message: 'If the email exists, a reset link has been sent.', resetUrl };
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      // Return a generic message to avoid user enumeration
      return { message: 'If the email exists, a reset link has been sent.' };
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.usersService.findByResetToken(dto.token);
    if (!record) throw new BadRequestException('Invalid or expired token');
    if (dayjs().isAfter(dayjs(record.reset_password_expires))) {
      throw new BadRequestException('Invalid or expired token');
    }
    await this.usersService.updatePassword(record._id.toString(), dto.password);
    await this.usersService.clearResetToken(record._id.toString());
    return { message: 'Password has been reset successfully' };
  }
}
