import {Observable, ReplaySubject} from "rxjs";
import {DatabaseService} from "@/domain/DatabaseService";

export class TeilnehmerService {
    private teilnehmerList$ = new ReplaySubject<string[]>();
    private teilnehmerListSnapshot:string[] = [];

    constructor(private databaseService: DatabaseService) {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        if(this.databaseService.has('teilnehmerList')) {
            this.teilnehmerListSnapshot = this.databaseService.get('teilnehmerList') as string[];
            console.log("Teilnehmer list loaded: ");
            console.log(this.teilnehmerListSnapshot);
        } else {
            console.warn("Failed to load Teilnehmer List. Probably the file does not exist! This normal if the " +
                "application is loaded for the first time.");
        }
        this.teilnehmerList$.next(this.teilnehmerListSnapshot);
    }

    private saveList(): void {
        this.databaseService.set('teilnehmerList', this.teilnehmerListSnapshot);
        this.databaseService.save();
        console.log("Saved list of Teilnehmer:");
        console.log(this.teilnehmerListSnapshot);
    }

    public reload(): void {
        this.teilnehmerListSnapshot = [];
        this.loadFromStorage();
    }

    public getTeilnehmerList$(): Observable<string[]>
    {
        return this.teilnehmerList$.asObservable();
    }

    public addTeilnehmer(name:string): void
    {
        const exists = this.teilnehmerListSnapshot.find(currentName => currentName === name) !== undefined;
        if(exists) {
            alert("Ein Teilnehmer mit diesem Namen existiert bereits");
        } else {
            this.teilnehmerListSnapshot.push(name);
            this.saveList();
            this.teilnehmerList$.next(this.teilnehmerListSnapshot);
        }
    }

    public removeTeilnehmer(name:string): void
    {
        const exists = this.teilnehmerListSnapshot.find(currentName => currentName === name) !== undefined;
        if(!exists) {
            alert("Teilnehmer nicht gefunden");
        } else {
            this.teilnehmerListSnapshot = this.teilnehmerListSnapshot.filter(currentName => currentName !== name);
            this.saveList();
            this.teilnehmerList$.next(this.teilnehmerListSnapshot);
        }
    }
}