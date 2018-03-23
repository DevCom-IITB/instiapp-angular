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

    /** Returns a human readable representation of a Date-Time */
    export function GetDate(obj: any): string {
        const date = new Date(obj);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const minutes = date.getMinutes();
        const hours = date.getHours();
        const monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December' ];
        let daySuffix = 'th';
        if (day % 10 === 1) {
        daySuffix = 'st';
        } else if (day % 10 === 2) {
        daySuffix = 'nd';
        }
        return Helpers.zeroPad(hours, 2) + ':' + Helpers.zeroPad(minutes, 2) + ' | ' +
            day + daySuffix + ' ' + monthNames[monthIndex];
    }
}
