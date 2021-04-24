/**
 * Finds for each Teilnehmer one allowed partner
 */
export class CalculateKombinationAlgorithm {

    private isCanceled = false;
    private teilnehmer2ChosenPartnerIndexMap = new Map<string, number>();
    private teilnehmerList:string[] = [];
    private teilnehmerIndex = 0;

    constructor(private teilnehmer2AllowedPartnersMap:Map<string, string[]>) {
        this.teilnehmerList = Array.from(this.teilnehmer2AllowedPartnersMap.keys()).sort();
    }

    public run(resultCallback:(teilnehmer2PartnerMap:Map<string, string | undefined>) => void): void
    {
        this.teilnehmerIndex = 0;

        while(this.teilnehmerIndex < this.teilnehmerList.length) {
            const teilnehmer = this.teilnehmerList[this.teilnehmerIndex];

            if(this.isCanceled) {
                return;
            }

            // if has already been assigned to a partner skip this teilnehmer
            if(this.existsPartnerIndex(this.teilnehmerIndex)) {
                this.teilnehmerIndex++;
                continue;
            }

            const countPartners = (this.teilnehmer2AllowedPartnersMap.get(teilnehmer) ?? []).length;

            const partnerIndex = this.getNextAllowedPartnerIndex(teilnehmer);

            const foundPartner = partnerIndex!==undefined;

            if(foundPartner) {
                this.teilnehmer2ChosenPartnerIndexMap.set(teilnehmer, partnerIndex as number);
                this.teilnehmer2ChosenPartnerIndexMap.set(this.teilnehmerList[partnerIndex as number], this.teilnehmerIndex); // link partner back to teilnehmer as well
            } else if(countPartners > 0) {

                // const nextTeilnehmerIndex = this.tryOtherPathIfPossible(teilnehmer);
                // if(nextTeilnehmerIndex !== undefined) {
                //     this.teilnehmerIndex = nextTeilnehmerIndex;
                //     continue;
                // }

                this.teilnehmer2ChosenPartnerIndexMap.set(teilnehmer, -1);
            }

            this.teilnehmerIndex++;
        }

        if(this.isCanceled) {
            return;
        }

        resultCallback(this.getTeilnehmer2ChosenPartnerMap());
    }

    private existsPartnerIndex(partnerIndex:number): boolean
    {
        let found = false;
        const partner = this.teilnehmerList[partnerIndex];
        this.teilnehmer2ChosenPartnerIndexMap.forEach((currentPartnerIndex, teilnehmer) => {
            if(currentPartnerIndex === partnerIndex || partner === teilnehmer) {
                found = true;
                return;
            }
        });
        return found;
    }

    private tryOtherPathIfPossible(teilnehmer:string): number | undefined
    {
        const partnerList = this.teilnehmer2AllowedPartnersMap.get(teilnehmer) ?? [];

        for(let i = 0; i < partnerList.length; i++) {

            const partner = partnerList[i];
            const partnerIndex = this.getIndexOfTeilnehmer(partner); // real index

            if(this.teilnehmer2ChosenPartnerIndexMap.get(partner) === -1) {
                continue; // teilnehmer has been assigned no teilnehmer because he has been processed fully without being able to find him a suitable teilnehmer
            }

            // Lets see if this partner be assigned to another partner of his own
            const nextPartnerOfPartnerIndex = this.getNextAllowedPartnerIndex(partner);
            if(nextPartnerOfPartnerIndex !== undefined) {

                const nextPartnerIndex = partnerIndex+1;
                const nextPartner = this.teilnehmerList[nextPartnerIndex];
                this.rollback(nextPartner);

                this.teilnehmer2ChosenPartnerIndexMap.set(partner, nextPartnerOfPartnerIndex as number);
                this.teilnehmer2ChosenPartnerIndexMap.set(this.teilnehmerList[nextPartnerOfPartnerIndex as number], partnerIndex); // link partner back to teilnehmer as well

                return nextPartnerIndex;
            }
        }

        return undefined;
    }

    private getTeilnehmer2ChosenPartnerMap(): Map<string, string | undefined>
    {
        const result = new Map<string, string | undefined>();
        this.teilnehmerList.forEach(teilnehmer => {
            const partnerIndex = this.teilnehmer2ChosenPartnerIndexMap.get(teilnehmer) ?? -1;
            const partner = this.teilnehmerList[partnerIndex] ?? undefined;
            result.set(teilnehmer, partner);
        });
        return result;
    }

    private getNextAllowedPartnerIndex(teilnehmer: string): number | undefined
    {
        const teilnehmerIndex = this.getIndexOfTeilnehmer(teilnehmer);

        const potentialPartnerList = this.getNotTriedPartners(teilnehmer);

        for(let i = 0; i < potentialPartnerList.length; i++) {
            const potentialPartner = potentialPartnerList[i];
            if(!this.hasTeilnehmerAlreadyAnPartnerAssigned(potentialPartner, teilnehmerIndex)) {
                return this.getIndexOfTeilnehmer(potentialPartner);
            }
        }

        return undefined;
    }

    private getNotTriedPartners(teilnehmer:string):string[]
    {
        const result:string[] = [];

        const allowedPartnerList = this.teilnehmer2AllowedPartnersMap.get(teilnehmer) ?? [];
        const currentlyChosenPartnerIndex = this.teilnehmer2ChosenPartnerIndexMap.get(teilnehmer) ?? -1;

        let partnerIndex = currentlyChosenPartnerIndex + 1;
        for(; partnerIndex < this.teilnehmerList.length; partnerIndex++) {
            const partner = this.teilnehmerList[partnerIndex];

            const isValidPartner = allowedPartnerList.find(currentPartner => currentPartner === partner) !== undefined;
            if(isValidPartner) {
                result.push(partner);
            }
        }

        return result;
    }

    private getIndexOfTeilnehmer(teilnehmer:string):number
    {
        return this.teilnehmerList.findIndex((currentTeilnehmer) => currentTeilnehmer===teilnehmer);
    }

    private hasTeilnehmerAlreadyAnPartnerAssigned(teilnehmer:string, maxTeilnehmerIndex:number): boolean
    {
        for(let i = 0; i < maxTeilnehmerIndex; i++) {
            const alreadyProcessedTeilnehmer = this.teilnehmerList[i];
            if(alreadyProcessedTeilnehmer === teilnehmer) {
                return true;
            }
            const partnerIndex = this.teilnehmer2ChosenPartnerIndexMap.get(alreadyProcessedTeilnehmer) ?? -1;
            if(this.teilnehmerList[partnerIndex] === teilnehmer) {
                return true;
            }
        }
        return false;
    }

    private rollback(targetTeilnehmer:string): void
    {
        const targetTeilnehmerIndex = this.teilnehmerList.findIndex((teilnehmer => teilnehmer === targetTeilnehmer));
        for(let i = this.teilnehmerIndex; i >= targetTeilnehmerIndex; i--) {
            const currentTeilnehmer = this.teilnehmerList[i];
            const chosenPartnerIndex = this.teilnehmer2ChosenPartnerIndexMap.get(currentTeilnehmer);
            if(chosenPartnerIndex !== undefined && chosenPartnerIndex >= targetTeilnehmerIndex) {
                this.teilnehmer2ChosenPartnerIndexMap.delete(currentTeilnehmer);
                this.teilnehmer2ChosenPartnerIndexMap.delete(this.teilnehmerList[chosenPartnerIndex]); // remove from partner as well
            }
        }
    }

    public stopAlgorithm(): void
    {
        this.isCanceled = true;
    }

}