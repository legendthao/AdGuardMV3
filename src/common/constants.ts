import { SettingsType } from './settings-constants';

export interface PopupData {
    settings: SettingsType
}

export interface OptionsData {
    settings: SettingsType
    filters: Filter[]
}

export enum MESSAGE_TYPES {
    GET_OPTIONS_DATA = 'GET_OPTIONS_DATA',
    GET_POPUP_DATA = 'GET_POPUP_DATA',
    GET_CSS = 'GET_CSS',
    OPEN_OPTIONS = 'OPEN_OPTIONS',
    SET_SETTING = 'SET_SETTING',
    REPORT_SITE = 'REPORT_SITE',
    OPEN_ASSISTANT = 'OPEN_ASSISTANT',
    START_ASSISTANT = 'START_ASSISTANT',
    ADD_USER_RULE = 'ADD_USER_RULE',
    RELOAD_ACTIVE_TAB = 'RELOAD_ACTIVE_TAB',
    REMOVE_PROTECTION_PAUSE_TIMER = 'REMOVE_PROTECTION_PAUSE_TIMER',
    SET_PAUSE_EXPIRES = 'SET_PAUSE_EXPIRES',
    ENABLE_FILTER = 'ENABLE_FILTER',
    DISABLE_FILTER = 'DISABLE_FILTER',
    GET_FILTER_INFO_BY_CONTENT = 'GET_FILTER_INFO_BY_CONTENT',
    ADD_CUSTOM_FILTER_BY_CONTENT = 'ADD_CUSTOM_FILTER_BY_CONTENT',
    GET_FILTER_CONTENT_BY_URL = 'GET_FILTER_CONTENT_BY_URL',
    REMOVE_CUSTOM_FILTER_BY_ID = 'REMOVE_CUSTOM_FILTER_BY_ID',

    ADD_LONG_LIVED_CONNECTION = 'ADD_LONG_LIVED_CONNECTION',
    NOTIFY_LISTENERS = 'NOTIFY_LISTENERS',
}

export type MessageType = keyof typeof MESSAGE_TYPES;

export type Message = {
    type: MessageType;
    data?: any;
};

export enum NOTIFIER_EVENTS {
    SETTING_UPDATED = 'event.setting.updated',
}

export const REPORT_SITE_BASE_URL = 'https://reports.adguard.com/new_issue.html';

// TODO add correct url
export const LEARN_MORE_URL = 'https://adguard.com/compare.html';

export const CUSTOM_GROUP_ID = 0;

/* GLOBAL FILTERING */
export const MILLISECONDS_IN_SECOND = 10 ** 3;
export const PROTECTION_PAUSE_TIMEOUT_S = 30;
export const PROTECTION_PAUSE_TIMEOUT_TICK_S = 1;
export const PROTECTION_PAUSE_TIMEOUT_MS = PROTECTION_PAUSE_TIMEOUT_S * MILLISECONDS_IN_SECOND;
export const PROTECTION_PAUSE_TIMEOUT_TICK_MS = PROTECTION_PAUSE_TIMEOUT_TICK_S
    * MILLISECONDS_IN_SECOND;
