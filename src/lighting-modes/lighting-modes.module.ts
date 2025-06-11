import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LightingModeDocument, LightingModeSchema } from './infrastructure/schemas/lighting-mode.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LightingModeDocument.name, schema: LightingModeSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class LightingModesModule {}
