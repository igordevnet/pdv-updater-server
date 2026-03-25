import { Module } from "@nestjs/common";
import { UpdateController } from "./update.controller";
import { UpdateService } from "./update.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Update, UpdateSchema } from "./entities/update.entity";
import { UpdateRepository } from "./repositories/update.repository";
import { GoogleSheetsModule } from "../../shared/modules/google/google-sheets.module";

@Module({
    imports: [MongooseModule.forFeature([{
        name: Update.name, schema: UpdateSchema
    }]),
        GoogleSheetsModule,
    ],
    controllers: [UpdateController],
    providers: [
        UpdateService,
        UpdateRepository,
    ],
    exports: [],
})
export class UpdateModule { }