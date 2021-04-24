import {DatabaseService} from "@/domain/DatabaseService";
import {TeilnehmerService} from "@/domain/TeilnehmerService";
import {VerbotenePaarungenService} from "@/domain/VerbotenePaarungenService";
import {ErlaubtePartnerService} from "@/domain/ErlaubtePartnerService";
import {ErlaubteKombinationenService} from "@/domain/ErlaubteKombinationenService";
import {ExportImportService} from "@/domain/ExportImportService";

class ContainerStatic {

    // Service  classes
    private databaseService: DatabaseService | undefined;
    private teilnehmerService: TeilnehmerService | undefined;
    private verbotenePaarungenService: VerbotenePaarungenService | undefined;
    private erlaubtePartnerService: ErlaubtePartnerService | undefined;
    private erlaubteKombinationenService: ErlaubteKombinationenService | undefined;
    private exportImportService: ExportImportService | undefined;

    public getDatabaseService(): DatabaseService {
        if (this.databaseService === undefined) {
            this.databaseService = new DatabaseService();
        }
        return this.databaseService;
    }

    public getTeilnehmerService(): TeilnehmerService {
        if (this.teilnehmerService === undefined) {
            this.teilnehmerService = new TeilnehmerService(this.getDatabaseService());
        }
        return this.teilnehmerService;
    }

    public getVerbotenePaarungenService(): VerbotenePaarungenService {
        if (this.verbotenePaarungenService === undefined) {
            this.verbotenePaarungenService = new VerbotenePaarungenService(this.getDatabaseService());
        }
        return this.verbotenePaarungenService;
    }

    public getErlaubtePartnerService(): ErlaubtePartnerService {
        if (this.erlaubtePartnerService === undefined) {
            this.erlaubtePartnerService = new ErlaubtePartnerService(this.getTeilnehmerService(), this.getVerbotenePaarungenService());
        }
        return this.erlaubtePartnerService;
    }

    public getErlaubteKombinationenService(): ErlaubteKombinationenService {
        if (this.erlaubteKombinationenService === undefined) {
            this.erlaubteKombinationenService = new ErlaubteKombinationenService(this.getErlaubtePartnerService());
        }
        return this.erlaubteKombinationenService;
    }

    public getExportImportService(): ExportImportService {
        if (this.exportImportService === undefined) {
            this.exportImportService = new ExportImportService(
                this.getDatabaseService(),
                this.getTeilnehmerService(),
                this.getVerbotenePaarungenService()
            );
        }
        return this.exportImportService;
    }

}

const containerStatic = new ContainerStatic();
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Container = () => containerStatic;
export default Container;