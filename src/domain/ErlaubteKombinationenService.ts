import {Observable, ReplaySubject} from "rxjs";
import {ErlaubtePartnerService} from "@/domain/ErlaubtePartnerService";
import {CalculateKombinationListAlgorithm} from "@/domain/kombination/CalculateKombinationListAlgorithm";

export class ErlaubteKombinationenService {

    private erlaubteKombinationenList$ = new ReplaySubject<Array<Map<string, string | undefined>>>();

    private calculation: CalculateKombinationListAlgorithm | undefined;

    constructor(erlaubtePartnerService:ErlaubtePartnerService) {
        erlaubtePartnerService.getTeilnehmer2ErlaubtePartnerMap$().subscribe(teilnehmer2AllowedPartnersMap => {
            if(this.calculation) {
                this.calculation.stopAlgorithm();
            }
            this.calculation = new CalculateKombinationListAlgorithm(teilnehmer2AllowedPartnersMap);
            this.calculation.run((kombinationList) => {
                this.erlaubteKombinationenList$.next(kombinationList);
            })
        });
    }

    public getErlaubteKombinationenList$(): Observable<Array<Map<string, string | undefined>>>
    {
        return this.erlaubteKombinationenList$.asObservable();
    }

}