import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './modules/users/users.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    try {
      await this.usersService.createAdminUser();
      console.log('✅ Admin user created/verified');
    } catch (error) {
      console.log('⚠️ Could not create admin user:', error.message);
    }
  }
}
