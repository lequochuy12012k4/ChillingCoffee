import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu.item.dto';
import { UpdateMenuItemDto } from './dto/update-menu.item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItems } from './schemas/menu.item.schema';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel(MenuItems.name) private readonly menuItemsModel: Model<MenuItems>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsModel.create(createMenuItemDto as any);
  }

  async findAll(filter?: Partial<{ category: 'drink' | 'cake' }>) {
    const query: any = {};
    if (filter?.category) query.category = filter.category;
    return this.menuItemsModel.find(query);
  }

  async findOne(id: string) {
    return this.menuItemsModel.findById(id);
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuItemsModel.findByIdAndUpdate(id, updateMenuItemDto as any, { new: true });
  }

  async remove(id: string) {
    return this.menuItemsModel.findByIdAndDelete(id);
  }
}


