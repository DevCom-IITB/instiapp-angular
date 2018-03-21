import { DataService } from './data.service';

export module Helpers {

    /** Get time in HH:MM format from date */
    export function GetTimeString(date: Date) {
        const dt = new Date(date);
        return zeroPad(dt.getHours(), 2) + ':' + zeroPad(dt.getMinutes(), 2);
    }

    /** Adds leading zeros to a number */
    export function zeroPad(num, places) {
        const zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join('0') + num;
    }
}
