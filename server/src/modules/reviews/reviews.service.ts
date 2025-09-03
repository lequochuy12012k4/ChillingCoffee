import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reviews } from './schemas/review.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Reviews.name) private readonly reviewsModel: Model<Reviews>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.reviewsModel.create(createReviewDto as any);
  }

  async findAll(filter?: Partial<{ menuItem: string }>) {
    const query: any = {};
    if (filter?.menuItem) query.menuItem = filter.menuItem;
    return this.reviewsModel.find(query).populate('user').populate('menuItem');
  }

  async findOne(id: string) {
    return this.reviewsModel.findById(id);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.reviewsModel.findByIdAndUpdate(id, updateReviewDto as any, { new: true });
  }

  async remove(id: string) {
    return this.reviewsModel.findByIdAndDelete(id);
  }
}


