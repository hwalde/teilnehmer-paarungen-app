import {Observable, ReplaySubject} from "rxjs";
import {DatabaseService} from "@/domain/DatabaseService";
import {Paarung} from "@/domain/Paarung";

export class VerbotenePaarungenService {
    private verbotenePaarungList$ = new ReplaySubject<Paarung[]>();
    private verbotenePaarungListSnapshot:Paarung[] = [];

    constructor(private databaseService: DatabaseService) {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        if(this.databaseService.has('verbotenePaarungList')) {
            this.verbotenePaarungListSnapshot = this.databaseService.get('verbotenePaarungList') as Paarung[];
            console.log("Verbotene Paarung list loaded: ");
            console.log(this.verbotenePaarungListSnapshot);
        } else {
            console.warn("Failed to load Verbotene Paarung List. Probably the file does not exist! This normal if the " +
                "application is loaded for the first time.");
        }
        this.verbotenePaarungList$.next(this.verbotenePaarungListSnapshot);
    }

    private saveList(): void {
        this.databaseService.set('verbotenePaarungList', this.verbotenePaarungListSnapshot);
        this.databaseService.save();
        console.log("Saved list of Verbotene Paarung:");
        console.log(this.verbotenePaarungListSnapshot);
    }

    public reload(): void {
        this.verbotenePaarungListSnapshot = [];
        this.loadFromStorage();
    }

    public getVerbotenePaarungenList$(): Observable<Paarung[]>
    {
        return this.verbotenePaarungList$.asObservable();
    }

    public addVerbotenePaarung(paarung:Paarung): void
    {
        const exists = this.verbotenePaarungListSnapshot.find(currentPaarung => {
            return currentPaarung.teilnehmer1 === paarung.teilnehmer1 && currentPaarung.teilnehmer2 === paarung.teilnehmer2;
        }) !== undefined;
        if(exists) {
            alert("Ein Verbotene Paarung mit diesem Namen existiert bereits");
        } else {
            this.verbotenePaarungListSnapshot.push(paarung);
            this.saveList();
            this.verbotenePaarungList$.next(this.verbotenePaarungListSnapshot);
        }
    }

    public removeVerbotenePaarung(paarung:Paarung): void
    {
        const exists = this.verbotenePaarungListSnapshot.find(currentPaarung => {
            return currentPaarung.teilnehmer1 === paarung.teilnehmer1 && currentPaarung.teilnehmer2 === paarung.teilnehmer2;
        }) !== undefined;
        if(!exists) {
            alert("Verbotene Paarung nicht gefunden");
        } else {
            this.verbotenePaarungListSnapshot = this.verbotenePaarungListSnapshot.filter(currentPaarung => {
                return currentPaarung.teilnehmer1 !== paarung.teilnehmer1 || currentPaarung.teilnehmer2 !== paarung.teilnehmer2;
            });
            this.saveList();
            this.verbotenePaarungList$.next(this.verbotenePaarungListSnapshot);
        }
    }
}