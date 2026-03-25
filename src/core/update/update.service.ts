import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import winVersionInfo from 'win-version-info';
import { DownloadFileDTO } from './dtos/download-file.dto';
import { UpdateRepository } from './repositories/update.repository';
import { GoogleSheetsService } from 'src/shared/modules/google/google-sheets.service';


@Injectable()
export class UpdateService {

    private readonly filePath;

    public constructor(
        private readonly updateRepository: UpdateRepository, 
        private readonly googleSheetsService: GoogleSheetsService
    ) {
        this.filePath = join(process.cwd(), 'files', 'PdvFX.exe');
    }

    public getLastestVersionFile() {

        const info = winVersionInfo(this.filePath);
        return info.FileVersion;  
    }

    public async getLastestFile(dto: DownloadFileDTO, deviceName: string) {

        const fileStream = await createReadStream(this.filePath);

        this.saveAndExport(dto, deviceName)

        return new StreamableFile(fileStream, {
            type: 'application/octet-stream',
            disposition: 'attachment; filename="pdv.exe"',
        });
    }

    private saveAndExport(dto: DownloadFileDTO, deviceName: string) {
        const version = this.getLastestVersionFile();
        
        const payload = {
            userId: dto.userId,
            deviceId: dto.deviceId,
            exeVersion: version,
        };

        this.updateRepository.createInstance(payload);

        const payloadSheet = {
            name: dto.name,
            deviceName: deviceName,
            version: version,
        };

        this.googleSheetsService.updatePdvVersion(payloadSheet);
    }
}