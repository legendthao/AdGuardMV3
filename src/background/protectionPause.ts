import { SETTINGS_NAMES } from 'Common/constants/settings-constants';

import { settings } from './settings';
import { tsWebExtensionWrapper } from './tswebextension';

class ProtectionPause {
    private readonly alarmHandler: () => void;

    private readonly reloadPageHandler: (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        tab: chrome.tabs.Tab
    ) => void;

    constructor() {
        this.alarmHandler = async () => {
            chrome.alarms.onAlarm.removeListener(this.alarmHandler);
            await settings.setProtection(true);
            await tsWebExtensionWrapper.start();
        };

        /* Page can be reloaded without closing the popup.
        Clear SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES once it is expired on page reload. */
        this.reloadPageHandler = async (tabId, changeInfo) => {
            if (changeInfo.status === 'complete' || changeInfo.status === 'loading') {
                const protectionPauseExpires = settings.getSetting<number>(
                    SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES,
                );

                if (protectionPauseExpires !== 0 && protectionPauseExpires <= Date.now()) {
                    await settings.setProtectionPauseExpires(0);
                }
            }
        };
    }

    addTimer = (protectionPauseExpires: number) => {
        chrome.alarms.onAlarm.addListener(this.alarmHandler);
        chrome.alarms.create(
            SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES,
            { when: protectionPauseExpires },
        );
        chrome.tabs.onUpdated.addListener(this.reloadPageHandler);
    };

    removeTimer = () => {
        chrome.alarms.onAlarm.removeListener(this.alarmHandler);
        chrome.tabs.onUpdated.removeListener(this.reloadPageHandler);
    };
}

export const protectionPause = new ProtectionPause();
