// Include in the render side
import {DatabaseService} from "@/domain/DatabaseService";
import {TeilnehmerService} from "@/domain/TeilnehmerService";
import {VerbotenePaarungenService} from "@/domain/VerbotenePaarungenService";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const remote = require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

export class ExportImportService {

    constructor(
        private databaseService:DatabaseService,
        private teilnehmerService:TeilnehmerService,
        private verbotenePaarungenService:VerbotenePaarungenService
    ) {}

    public export(defaultFileName:string, onSuccessCallback:() => void, onErrorCallback:(errorMessage:string) => void): void
    {
        const toLocalPath = path.resolve(app.getPath("home"), defaultFileName)

        dialog.showSaveDialog(
            { defaultPath: toLocalPath }
        ).then((result:Electron.SaveDialogReturnValue) => {
            console.log(result.canceled);
            console.log(result.filePath);
            if(!result.canceled && result.filePath !== undefined) {
                this.saveDatabaseToFile(result.filePath, onSuccessCallback, onErrorCallback);
            }
        }).catch((err: string) => {
            onErrorCallback(err);
        });
    }


    private saveDatabaseToFile (filePath:string, onSuccessCallback:() => void, onErrorCallback:(errorMessage:string) => void): void
    {
        const databaseDump = this.databaseService.exportDatabaseAsString();
        fs.writeFile(filePath, databaseDump,'utf8', (err: NodeJS.ErrnoException | null) => {
            if (err) {
                onErrorCallback(err.message);
            } else {
                onSuccessCallback();
            }
        });
    }

    public import(defaultFileName:string, onSuccessCallback:() => void, onErrorCallback:(errorMessage:string) => void): void
    {
        const toLocalPath = path.resolve(app.getPath("home"), defaultFileName)

        dialog.showOpenDialog(
            {
                defaultPath: toLocalPath,
                multiSelections:false,
                openDirectory:false,
                openFile:true
            }
        ).then((result:Electron.OpenDialogReturnValue) => {
            console.log(result.canceled);
            console.log(result.filePaths);
            if(!result.canceled) {
                this.loadDatabaseFromFile(result.filePaths[0], onSuccessCallback, onErrorCallback);
            }
        }).catch((err: string) => {
            onErrorCallback(err);
        });
    }

    public loadDatabaseFromFile(filePath:string, onSuccessCallback:() => void, onErrorCallback:(errorMessage:string) => void): void
    {
        try {
            const data = fs.readFileSync(filePath, {encoding:'utf8'});
            console.log("Loaded the following data:");
            console.log(data);

            // todo: validate loaded data

            this.databaseService.importDatabaseFromString(data.toString("utf-8"));
            this.databaseService.save();
            this.teilnehmerService.reload();
            this.verbotenePaarungenService.reload();
            onSuccessCallback();
        } catch (e) {
            console.error(e);
            onErrorCallback(e.message);
        }
    }

}