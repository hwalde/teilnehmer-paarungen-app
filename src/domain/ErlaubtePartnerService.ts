import {Observable, ReplaySubject} from "rxjs";
import {TeilnehmerService} from "@/domain/TeilnehmerService";
import {VerbotenePaarungenService} from "@/domain/VerbotenePaarungenService";
import {Paarung} from "@/domain/Paarung";

export class ErlaubtePartnerService {

    private teilnehmer2ErlaubtePartnerMap$ = new ReplaySubject<Map<string, string[]>>();

    private teilnehmerList:string[] = [];
    private verbotenePaarungList:Paarung[] = [];

    constructor(private teilnehmerService:TeilnehmerService, private verbotenePaarungenService:VerbotenePaarungenService) {
        let hasLoadedTeilnehmerList = false;
        let hasLoadedVerbotenePaarungen = false;
        teilnehmerService.getTeilnehmerList$().subscribe(teilnehmerList => {
            this.teilnehmerList = teilnehmerList;
            hasLoadedTeilnehmerList = true;
            if(hasLoadedTeilnehmerList && hasLoadedVerbotenePaarungen) {
                this.calculate();
            }
        });
        verbotenePaarungenService.getVerbotenePaarungenList$().subscribe(verbotenePaarungList => {
            this.verbotenePaarungList = verbotenePaarungList;
            hasLoadedVerbotenePaarungen = true;
            if(hasLoadedTeilnehmerList && hasLoadedVerbotenePaarungen) {
                this.calculate();
            }
        });
    }

    private calculate(): void {
        const teilnehmer2ErlaubtePartnerMap = new Map<string, string[]>();

        const teilnehmerList = this.teilnehmerList.sort();
        const verbotenePaarungList = this.verbotenePaarungList;

        teilnehmerList.forEach(teilnehmer => {
            const allowedPartnerList:string[] = [];

            teilnehmerList.forEach(partner => {
                if(verbotenePaarungList.find(paarung => {
                    return partner === teilnehmer
                        ||
                        (paarung.teilnehmer1 === teilnehmer && paarung.teilnehmer2 === partner)
                        ||
                        (paarung.teilnehmer2 === teilnehmer && paarung.teilnehmer1 === partner);
                }) === undefined) {
                    allowedPartnerList.push(partner);
                }
            });

            teilnehmer2ErlaubtePartnerMap.set(teilnehmer, allowedPartnerList);
        });

        this.teilnehmer2ErlaubtePartnerMap$.next(teilnehmer2ErlaubtePartnerMap);
    }

    public getTeilnehmer2ErlaubtePartnerMap$(): Observable<Map<string, string[]>>
    {
        return this.teilnehmer2ErlaubtePartnerMap$.asObservable();
    }

}