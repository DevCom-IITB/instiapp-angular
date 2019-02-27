/// <reference types='@types/winrt-uwp' />

import { noop, Observable } from 'rxjs';
import { IEvent } from './interfaces';
import { environment } from '../environments/environment';

export module WinRT {
    export function is(): boolean {
        return (typeof Windows !== 'undefined' &&
                typeof Windows.UI !== 'undefined');
    }

    export function init(): boolean {
        if (!is()) { return false; }

        /* Colors */
        const theme = Windows.UI.ColorHelper.fromArgb(255, 83, 109, 254);
        const themeHover = Windows.UI.ColorHelper.fromArgb(255, 80, 105, 244);

        /* Customize title bar */
        const titleBar = Windows.UI.ViewManagement.ApplicationView.getForCurrentView().titleBar;
        titleBar.backgroundColor = theme;
        titleBar.foregroundColor = Windows.UI.Colors.white;
        titleBar.inactiveBackgroundColor = theme;
        titleBar.inactiveForegroundColor = Windows.UI.Colors.white;
        titleBar.buttonBackgroundColor = theme;
        titleBar.buttonForegroundColor = Windows.UI.Colors.white;
        titleBar.buttonInactiveBackgroundColor = theme;
        titleBar.buttonInactiveForegroundColor = Windows.UI.Colors.white;
        titleBar.buttonHoverBackgroundColor = themeHover;
        titleBar.buttonHoverForegroundColor = Windows.UI.Colors.white;
        titleBar.buttonPressedBackgroundColor = themeHover;
        titleBar.buttonPressedForegroundColor = Windows.UI.Colors.white;

        return true;
    }

    /** Create or update a list of appointments from a list of events */
    export function updateAppointments(events: IEvent[], remove = false): void {
        if (!is() || Windows.ApplicationModel.Appointments === undefined) { return; }

        getCalendar().subscribe(cal => {
            getAppointmentStore().then(store => {
                /* Create all appointments */
                for (const event of events) {
                    const appointment = new Windows.ApplicationModel.Appointments.Appointment();
                    appointment.startTime = new Date(event.start_time);
                    appointment.subject = event.name;
                    appointment.location = event.venues.map(v => v.short_name).join(', ');
                    appointment.duration = new Date(event.end_time).getTime() - new Date(event.start_time).getTime();
                    appointment.roamingId = 'instiapp-' + event.id;
                    appointment.details = event.description;
                    appointment.uri = new Windows.Foundation.Uri(`${environment.host}event/${event.str_id}`);

                    /** Add or update */
                    store.findLocalIdsFromRoamingIdAsync(appointment.roamingId).then(ids => {
                        if (ids.length === 0) {
                            if (!remove) {
                                cal.saveAppointmentAsync(appointment).then();
                            }
                        } else {
                            for (const id of ids) {
                                if (remove) {
                                    cal.deleteAppointmentAsync(id).then();
                                } else {
                                    cal.getAppointmentAsync(id).then(app => {
                                        app.subject = appointment.subject;
                                        app.startTime = appointment.startTime;
                                        app.duration = appointment.duration;
                                        app.location = appointment.location;
                                        app.duration = appointment.duration;
                                        app.details = appointment.details;
                                        app.uri = appointment.uri;
                                        cal.saveAppointmentAsync(app).then();
                                    });
                                }
                            }
                        }
                    });
                }
            });
        });
    }

    /** Get the appointment store */
    function getAppointmentStore() {
        const AppointmentManager = Windows.ApplicationModel.Appointments.AppointmentManager;
        return AppointmentManager.requestStoreAsync(
            Windows.ApplicationModel.Appointments.AppointmentStoreAccessType.appCalendarsReadWrite);
    }

    /** Get the calendar of the current app */
    function getCalendar(nomore = false): Observable<Windows.ApplicationModel.Appointments.AppointmentCalendar> {
        const LS_KEY = 'calendar';
        const createCal = (store, observer) => {
            store.createAppointmentCalendarAsync('Events').then(cal => {
                localStorage.setItem(LS_KEY, cal.localId);
                observer.next(cal);
                observer.complete();
            });
        };

        return Observable.create(observer => {
            getAppointmentStore().then(store => {
                store.getAppointmentCalendarAsync(localStorage.getItem(LS_KEY)).then(cal => {
                    if (!nomore && cal === null)  {
                        localStorage.removeItem(LS_KEY);
                        createCal(store, observer);
                        return;
                    }
                    observer.next(cal);
                    observer.complete();
                }, () => {
                    createCal(store, observer);
                });
            });
        });
    }

    /** Share a URL with the native function */
    export function nativeShare(title: string, text: string, url: string): void {
        const dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
        dataTransferManager.addEventListener('datarequested', (p) => {
            p.request.data.properties.title = title;
            p.request.data.properties.description = text;
            p.request.data.setWebLink(new Windows.Foundation.Uri(url));
        });
        Windows.ApplicationModel.DataTransfer.DataTransferManager.showShareUI();
    }

    /** Open URI */
    export function openUri(uri: string): void {
        const wUri = new Windows.Foundation.Uri(uri);
        Windows.System.Launcher.launchUriAsync(wUri).then(noop);
    }
}
