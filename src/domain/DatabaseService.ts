// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('electron').remote.app;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

export class DatabaseService {

    private data = new Map<string, unknown>();

    constructor() {
        console.log("data file filepath is: " + this.getDataFilePath());
        this.loadDataFromFilesystem();
    }

    private loadDataFromFilesystem() {
        if(this.existsDataFile()) {
            this.importDatabaseFromString(this.getDataFileContent());
        }
    }

    private existsDataFile(): boolean {
        return fs.existsSync(this.getDataFilePath());
    }

    private getDataFilePath(): string {
        return path.join(this.getUserDataFolderPath(), 'data.json');
    }

    private getUserDataFolderPath(): string {
        return app.getPath('userData');
    }

    public importDatabaseFromString(dataString:string) {
        this.data = JSON.parse(dataString, this.reviver);
    }

    private reviver(key:unknown, value:{dataType:string, value:never}) {
        if(typeof value === 'object' && value !== null) {
            if (value.dataType === 'Map') {
                return new Map(value.value);
            }
        }
        return value;
    }

    private getDataFileContent(): string
    {
        return fs.readFileSync(this.getDataFilePath(), 'utf8');
    }

    public get(key:string): undefined | unknown {
        if(this.data.has(key)) {
            return this.data.get(key);
        }
        return undefined;
    }

    public has(key:string): boolean {
        return this.data.has(key);
    }

    public set(key: string, value: unknown): void {
        this.data.set(key, value);
    }

    public save(): void {
        fs.writeFileSync(this.getDataFilePath(), this.exportDatabaseAsString(), 'utf8');
    }

    public exportDatabaseAsString():string
    {
        return JSON.stringify(this.data, this.replacer);
    }

    private replacer(key:unknown, value:unknown) {
        if(value instanceof Map) {
            return {
                dataType: 'Map',
                value: Array.from(value.entries()), // or with spread: value: [...value]
            };
        } else {
            return value;
        }
    }

    public eraseAllData(): void
    {
        this.data = new Map<string, unknown>();
    }

}