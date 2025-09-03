import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu.items.service';
import { MenuItemsController } from './menu.items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItems, MenuItemsSchema } from './schemas/menu.item.schema';

@Module({
  imports : [MongooseModule.forFeature([{name : MenuItems.name, schema : MenuItemsSchema}])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
})
export class MenuItemsModule {}


