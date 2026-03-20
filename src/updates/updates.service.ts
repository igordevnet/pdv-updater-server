import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';


@Injectable()
export class UpdatesService {

    getLatestVersion(){
        return {
            version: '1.0.0',
            filename: 'Pdv.exe'
        };
    }

    getLatestFile(): StreamableFile {
        const caminho = join(process.cwd(), 'arquivos', 'pdv.exe');

        const fileStream = createReadStream(caminho);

        return new StreamableFile(fileStream);
    }
}
