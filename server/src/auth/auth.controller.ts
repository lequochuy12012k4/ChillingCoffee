import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, ForgotPasswordDto, ResetPasswordDto } from './dto/create-auth.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/modules/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailerService,
    private readonly usersService: UsersService
  ) { }

  @Post("login")
  @Public()
  @UseGuards(LocalAuthGuard)
  async handleLogin(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.message === 'Invalid email or password') {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED
        );
      }
      if (error.message === 'Account is not activated. Please check your email for the activation code.') {
        throw new HttpException(
          'Account is not activated. Please check your email for the activation code.',
          HttpStatus.UNAUTHORIZED
        );
      }
      throw new HttpException(
        error.message || 'Login failed',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post("register")
  @Public()
  async register(@Body() registerDto: CreateAuthDto) {
    try {
      return this.authService.handleRegister(registerDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Registration failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post("google")
  @Public()
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    try {
      return this.authService.googleAuth(googleAuthDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Google authentication failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post("activate")
  @Public()
  async activateAccount(@Body() activateDto: ActivateAccountDto) {
    try {
      return this.authService.activateAccount(activateDto.code);
    } catch (error) {
      throw new HttpException(
        error.message || 'Account activation failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    try {
      return await this.authService.forgotPassword(dto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send reset email',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('reset-password')
  @Public()
  async resetPassword(@Body("email") email: string, @Body() dto: ResetPasswordDto) {
    try {
      return await this.authService.resetPassword(dto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to reset password',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      const user = await this.usersService.findById(req.user._id);
      if (user) {
        const { password, ...userWithoutPassword } = user.toObject();
        // Ensure name is present by falling back to JWT payload
        return {
          ...userWithoutPassword,
          name: userWithoutPassword.name || req.user.name || userWithoutPassword.email,
          email: userWithoutPassword.email || req.user.email,
        };
      }
      // Fallback to JWT payload when DB user is not found
      return {
        _id: req.user._id,
        name: req.user.name || req.user.email,
        email: req.user.email,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('mail')
  @Public()
  testmain(){
    this.mailService
      .sendMail({
        to: 'quochuy120124@gmail.com', // list of receivers
        // from: 'noreply@nestjs.com', // sender address
        subject: 'Lê Quốc Huy', // Subject line
        text: 'welcome', // plaintext body
        template : "register", // HTML body content
        context:{
          name: "Lê Quốc Huy",
          activationCode: 123456
        }
      })
      
    return "This is a test mail";
  }
}



