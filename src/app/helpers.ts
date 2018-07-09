import { DataService } from './data.service';

export module Helpers {

    /** Get time in HH:MM format from date */
    export function GetTimeString(date: Date) {
        const dt = new Date(date);
        return `${zeroPad(dt.getHours(), 2)}:${zeroPad(dt.getMinutes(), 2)}`;
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
        } else if (day % 10 === 3) {
            daySuffix = 'rd';
        }
        return Helpers.zeroPad(hours, 2) + ':' + Helpers.zeroPad(minutes, 2) + ' | ' +
            day + daySuffix + ' ' + monthNames[monthIndex];
    }

    /**
     * Helper for infinite scrolling
     * @param callback void to call when user reaches bottom of scroll
     */
    export function CheckScrollBottom(callback: () => any): void {
        /* Work around browser specific implementations
         * Try documentElement scrollHeight, then body and finally give up */
        let maxScroll = document.documentElement.scrollHeight;
        if (maxScroll === 0) { maxScroll = document.body.scrollHeight; }
        if (maxScroll === 0) { return; }

        if ((window.innerHeight + window.scrollY) >= maxScroll - 60) {
          callback();
        }
    }

    /** Try native share and return false if failed */
    export function NativeShare(title, text, url) {
        const nav: any = navigator;
        if (nav.share) {
            nav.share({
                title: title,
                text: text,
                url: url,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
            return true;
        }
        return false;
    }

    /** Strips img tags replacing with alt from string */
    export function stripImg(str: string): string {
        /* Parse the item */
        const doc = new DOMParser().parseFromString(str, 'text/html');

        /* Iterate over all images */
        const images = doc.getElementsByTagName('img');
        for (const img of Array.from(images)) {
            /* Remove insecure images */
            if (img.src.startsWith('http://')) {
                img.insertAdjacentHTML('beforebegin', img.alt);
                img.remove();
            }
        }

        /* Re-serialize */
        return new XMLSerializer().serializeToString(doc);
    }

}
