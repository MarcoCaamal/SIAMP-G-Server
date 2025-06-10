export class Device {
    constructor(
        public id: string,
        public name: string,
        public type: string,
        public status: string,
        public lastActive: Date
    ) {}
}