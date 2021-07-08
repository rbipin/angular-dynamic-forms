export class UidGenerator {
    private currentUid?: string;
    private newUid = Date.now();
    generate(): string {
        if (this.currentUid === this.newUid.toString()) {
            this.newUid = (this.newUid + 1);
        }
        this.currentUid = this.newUid.toString();
        return this.newUid.toString();
    }
}
