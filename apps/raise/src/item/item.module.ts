import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './item.schema';
import { Operator, OperatorSchema } from '../operator/schema/operator.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Item.name,
        schema: ItemSchema,
      },
      {
        name: Operator.name,
        schema: OperatorSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ProjectModule {}
