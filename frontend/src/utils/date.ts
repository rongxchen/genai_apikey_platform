class Datetime {
    timestamp: number;
    date: Date;

    constructor(timestamp: number) {
        this.timestamp = timestamp;
        this.date = new Date(timestamp);
    }

    getDate() {
        return this.date;
    }

    getDateString() {
        return this.date.toISOString().split('T')[0];
    }

    getYearMonthString() {
        return `${this.date.getFullYear()}-${this.date.getMonth() + 1}`;
    }

    isToday() {
        const today = new Date();
        return this.date.toDateString() === today.toDateString();
    }

    isYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return this.date.toDateString() === yesterday.toDateString();
    }

    isPreviousSeven() {
        const today = new Date();
        const diff = today.getTime() - this.date.getTime();
        return diff <= 7 * 24 * 60 * 60 * 1000;
    }
}

export default Datetime;
