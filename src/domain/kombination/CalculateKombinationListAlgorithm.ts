import {CalculateKombinationAlgorithm} from "@/domain/kombination/CalculateKombinationAlgorithm";

/**
 * Finds as many Kombinationen as possible
 */
export class CalculateKombinationListAlgorithm {

    private isCanceled = false;
    private kombinationCalculation: CalculateKombinationAlgorithm | undefined;
    private kombinationenList = new Array<Map<string, string | undefined>>();
    private teilnehmer2AllowedPartnersMap:Map<string, string[]> = new Map<string, string[]>();

    constructor(teilnehmer2AllowedPartnersMap:Map<string, string[]>) {
        teilnehmer2AllowedPartnersMap.forEach((allowedPartners, teilnehmer) => {
            this.teilnehmer2AllowedPartnersMap.set(teilnehmer, allowedPartners);
        });
    }

    public run(resultCallback:(kombinationenList:Array<Map<string, string | undefined>>) => void): void
    {
        this.calculateKombinationRecursively(resultCallback);
    }

    private calculateKombinationRecursively(resultCallback:(kombinationenList:Array<Map<string, string | undefined>>) => void): void
    {
        this.kombinationCalculation = new CalculateKombinationAlgorithm(this.teilnehmer2AllowedPartnersMap);
        this.kombinationCalculation.run(kombination => {
            if(this.isCanceled) {
                return; // do nothing further
            }
            if(this.isKombinationEmpty(kombination)) {
                resultCallback(this.kombinationenList);
            } else {
                this.kombinationenList.push(kombination);
                this.removeUsedPartners(kombination);
                this.calculateKombinationRecursively(resultCallback);
            }
        });
    }

    private isKombinationEmpty(kombination:Map<string, string | undefined>): boolean
    {
        for(const teilnehmer of Array.from(kombination.keys())) {
            const partner = kombination.get(teilnehmer);
            if(partner !== undefined) {
                return false;
            }
        }
        return true;
    }

    private removeUsedPartners(kombination:Map<string, string | undefined>): void
    {
        kombination.forEach((partner, teilnehmer) => {
           if(partner === undefined) {
               return; // next foreach iteration
           }

           let allowedPartners = this.teilnehmer2AllowedPartnersMap.get(teilnehmer) ?? [];

           // remove partner
           allowedPartners = allowedPartners.filter(allowedPartner => allowedPartner !== partner);

           this.teilnehmer2AllowedPartnersMap.set(teilnehmer, allowedPartners);
        });
    }

    public stopAlgorithm(): void
    {
        if(this.kombinationCalculation) {
            this.kombinationCalculation.stopAlgorithm();
        }
        this.isCanceled = true;
    }

}