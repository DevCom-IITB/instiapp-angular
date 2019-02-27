/// <reference types="@types/winrt-uwp" />

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
}
