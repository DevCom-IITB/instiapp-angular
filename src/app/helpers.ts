import { IEvent } from './interfaces';

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
     * @returns current value of scroll
     */
    export function CheckScrollBottom(callback: () => any): number {
        /* Work around browser specific implementations
         * Try documentElement scrollHeight, then body and finally give up */
        let maxScroll = document.documentElement.scrollHeight;
        if (maxScroll === 0) { maxScroll = document.body.scrollHeight; }
        if (maxScroll === 0) { return 0; }

        /* Detect scrolling to bottom */
        if ((window.innerHeight + window.scrollY) >= maxScroll - 60) {
          callback();
        }

        return window.innerHeight + window.scrollY;
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

    /**
     * Strips insecure HTTP img tags, replacing with alt from string
     * @param html valid HTML string
     */
    export function stripImg(doc: Document): void {
        /* Iterate over all images */
        const images = doc.getElementsByTagName('img');
        for (const img of Array.from(images)) {
            /* Remove insecure images */
            if (img.src.startsWith('http://')) {
                img.insertAdjacentHTML('beforebegin', img.alt);
                img.remove();
            }
        }
    }

    /**
     * Add target=_blank and rel=noopener to HTML string links
     * Also adds the class noprop
     * @param html valid HTML string
     */
    export function addTargetBlank(doc: Document): void {
        /* Iterate over all links */
        const links = doc.getElementsByTagName('a');
        for (const a of Array.from(links)) {
            a.target = '_blank';
            a.rel = 'noopener';
            a.classList.add('noprop');
        }
    }

    /** Process HTML to be displayed with markdown */
    export function processMDHTML(html: string): string {
        return processHTMLString(html, (doc) => {
            addTargetBlank(doc);
            stripImg(doc);
        });
    }

    /**
     * Helper for procissing HTML strings
     * @param html valid HTML string
     * @param fun callback to execute on Document object
     */
    export function processHTMLString(html: string, fun: (doc: Document) => void): string {
        /* Parse the HTML */
        const doc = new DOMParser().parseFromString(html, 'text/html');

        /* Process */
        fun(doc);

        /* Process and re-serialize */
        return new XMLSerializer().serializeToString(doc);
    }

    /**
     * Gets query parameters by name
     * @param name Name of the query parameter
     * @param url URL to look in (defaults to current url)
     */
    export function getParameterByName(name, url = null) {
        if (!url) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) { return null; }
        if (!results[2]) { return ''; }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    export function GetEventSubtitle(event: IEvent): string {
        if (event) {
            /* Generate venue subtitle */
            event.venues_str = event.venues.map(v => v.short_name).join(', ');

            /* Init times */
            event.start_time = new Date(event.start_time.toString());
            event.end_time = new Date(event.end_time.toString());

            /* Check for ongoing/ended events */
            let subtitleTime = GetDate(event.start_time);
            const now = new Date();
            if (now > event.start_time) {
                if (now < event.end_time) {
                    subtitleTime = 'Ends ' + GetDate(event.end_time);
                } else {
                    subtitleTime = 'Ended | ' + GetDate(event.start_time);
                }
            }

            /* Get the subtitle */
            return subtitleTime + (event.venues.length > 0 ?  ' | ' + event.venues_str : '');
        }
        return '';
    }

    /** Tries to preload an image and calls back when done */
    export function preloadImage(url: string, callback: any, error: any = null) {
        /* Skip for invalid URLs */
        if (url === null || url === '') {
            callback();
            return;
        }

        /* Preload the image */
        const img = new Image();
        img.onload = callback;
        img.onerror = error || callback;
        img.src = url;
    }

}
