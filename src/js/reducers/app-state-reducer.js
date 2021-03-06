import * as AppStateActions from '../actions/app-state-actions';
import { RESET } from '../actions/common-actions';
import { RESET_CONVERSATION, ADD_MESSAGE } from '../actions/conversation-actions';
import { WIDGET_STATE } from '../constants/app';
import {SET_DISPLAY_AGENTS} from '../actions/app-state-actions';
import {SET_CHAT_OFFLINE} from '../actions/app-state-actions';
import {SET_CAMPAIGNS} from '../actions/app-state-actions';
import {INCREMENT_TIME_SPENT_ON_PAGE} from '../actions/app-state-actions';
import {DISPLAY_CAMPAIGN} from '../actions/app-state-actions';
import {HIDE_CAMPAIGN} from '../actions/app-state-actions';
import {storage} from '../utils/storage';
import {CAMPAIGNS_SEEN_KEY} from '../actions/app-state-actions';

const INITIAL_STATE = {
    settingsVisible: false,
    visibleChannelType: null,
    widgetState: WIDGET_STATE.INIT,
    settingsEnabled: true,
    soundNotificationEnabled: true,
    imageUploadEnabled: true,
    emailCaptureEnabled: false,
    readOnlyEmail: false,
    embedded: false,
    serverURL: 'https://api.smooch.io/',
    connectNotificationTimestamp: null,
    errorNotificationMessage: null,
    introHeight: 158,
    showAnimation: false,
    isFetchingMoreMessages: false,
    shouldScrollToBottom: true,
    typingIndicatorShown: false,
    typingIndicatorAvatarUrl: null,
    typingIndicatorName: null,
    typingIndicatorTimeoutId: null,

    // Gorgias variables
    displayAgents: [],
    isChatOnline: true,
    campaigns: [],
    displayedCampaigns: [],
    timeSpentOnPage: 0
};

export function AppStateReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return {
                ...INITIAL_STATE
            };
        case RESET_CONVERSATION:
            return {
                ...state,
                connectNotificationTimestamp: null
            };

        case AppStateActions.ENABLE_EMAIL_CAPTURE:
            return {
                ...state,
                emailCaptureEnabled: true
            };

        case AppStateActions.DISABLE_EMAIL_CAPTURE:
            return {
                ...state,
                emailCaptureEnabled: false
            };

        case AppStateActions.ENABLE_IMAGE_UPLOAD:
            return {
                ...state,
                imageUploadEnabled: true
            };

        case AppStateActions.DISABLE_IMAGE_UPLOAD:
            return {
                ...state,
                imageUploadEnabled: false
            };

        case AppStateActions.ENABLE_SOUND_NOTIFICATION:
            return {
                ...state,
                soundNotificationEnabled: true
            };

        case AppStateActions.DISABLE_SOUND_NOTIFICATION:
            return {
                ...state,
                soundNotificationEnabled: false
            };

        case AppStateActions.SET_EMAIL_READONLY:
            return {
                ...state,
                readOnlyEmail: true
            };

        case AppStateActions.UNSET_EMAIL_READONLY:
            return {
                ...state,
                readOnlyEmail: false
            };

        case AppStateActions.TOGGLE_WIDGET:

            return {
                ...state,
                widgetState: state.widgetState === WIDGET_STATE.OPENED ? WIDGET_STATE.CLOSED : WIDGET_STATE.OPENED,
                settingsVisible: state.settingsVisible && state.widgetState !== WIDGET_STATE.OPENED,
                showAnimation: true
            };

        case AppStateActions.OPEN_WIDGET:
            return {
                ...state,
                widgetState: WIDGET_STATE.OPENED,
                showAnimation: true
            };

        case AppStateActions.CLOSE_WIDGET:
            return {
                ...state,
                visibleChannelType: null,
                widgetState: WIDGET_STATE.CLOSED,
                settingsVisible: false,
                showAnimation: true
            };

        case AppStateActions.SHOW_SETTINGS:
            return {
                ...state,
                settingsVisible: true
            };

        case AppStateActions.HIDE_SETTINGS:
            return {
                ...state,
                settingsVisible: false
            };

        case AppStateActions.SHOW_CHANNEL_PAGE:
            return {
                ...state,
                visibleChannelType: action.channelType
            };

        case AppStateActions.HIDE_CHANNEL_PAGE:
            return {
                ...state,
                visibleChannelType: undefined
            };

        case AppStateActions.SHOW_CONNECT_NOTIFICATION:
            return {
                ...state,
                connectNotificationTimestamp: action.timestamp
            };

        case AppStateActions.HIDE_CONNECT_NOTIFICATION:
            return {
                ...state,
                connectNotificationTimestamp: null
            };

        case AppStateActions.SET_SERVER_URL:
            return {
                ...state,
                serverURL: action.url
            };

        case AppStateActions.SHOW_ERROR_NOTIFICATION:
            return {
                ...state,
                errorNotificationMessage: action.message
            };

        case AppStateActions.HIDE_ERROR_NOTIFICATION:
            return {
                ...state,
                errorNotificationMessage: null
            };

        case AppStateActions.SET_EMBEDDED:
            return {
                ...state,
                embedded: action.value,
                widgetState: action.value ? WIDGET_STATE.OPENED : state.widgetState
            };

        case AppStateActions.SET_INTRO_HEIGHT:
            return {
                ...state,
                introHeight: action.value
            };

        case AppStateActions.DISABLE_ANIMATION:
            return {
                ...state,
                showAnimation: false
            };

        case AppStateActions.SET_FETCHING_MORE_MESSAGES:
            return {
                ...state,
                isFetchingMoreMessages: action.value
            };
        case AppStateActions.SET_SHOULD_SCROLL_TO_BOTTOM:
            return {
                ...state,
                shouldScrollToBottom: action.value
            };

        case AppStateActions.SHOW_TYPING_INDICATOR:
            return {
                ...state,
                typingIndicatorShown: true,
                typingIndicatorAvatarUrl: action.avatarUrl,
                typingIndicatorName: action.name,
                typingIndicatorTimeoutId: action.timeoutId
            };
        case AppStateActions.HIDE_TYPING_INDICATOR:
            return {
                ...state,
                typingIndicatorShown: false,
                typingIndicatorName: null,
                typingIndicatorAvatarUrl: null,
                typingIndicatorTimeoutId: null
            };

        case ADD_MESSAGE:
            if (action.message.role === 'appMaker') {
                return {
                    ...state,
                    typingIndicatorShown: false,
                    typingIndicatorName: null,
                    typingIndicatorAvatarUrl: null,
                    typingIndicatorTimeoutId: null
                };
            }

            return state;

        // Gorgias handlers
        case SET_DISPLAY_AGENTS:
            return {
                ...state,
                displayAgents: action.displayAgents
            };

        case SET_CHAT_OFFLINE:
            return {
                ...state,
                isChatOnline: false
            };

        case SET_CAMPAIGNS:
            return {
                ...state,
                campaigns: action.campaigns
            };

        case INCREMENT_TIME_SPENT_ON_PAGE:
            return {
                ...state,
                timeSpentOnPage: state.timeSpentOnPage + action.seconds
            };

        case DISPLAY_CAMPAIGN: {
            if (state.displayedCampaigns.find((c) => c.id === action.campaign.id)) {
                return state;
            }

            let campaignsSeen = storage.getItem(CAMPAIGNS_SEEN_KEY);

            if (campaignsSeen) {
                campaignsSeen = campaignsSeen.split(',');

                if (campaignsSeen.includes(action.campaign.id)) {
                    return state;
                }
            }

            const newDisplayedCampaigns = [].concat(state.displayedCampaigns);
            newDisplayedCampaigns.push(action.campaign);

            return {
                ...state,
                displayedCampaigns: newDisplayedCampaigns
            };
        }

        case HIDE_CAMPAIGN: {
            const newCampaigns = [].concat(state.campaigns)
                .filter((c) => c.id !== action.campaign.id);
            const newDisplayedCampaigns = [].concat(state.displayedCampaigns)
                .filter((c) => c.id !== action.campaign.id);

            let campaignsSeen = storage.getItem(CAMPAIGNS_SEEN_KEY);

            if (!campaignsSeen) {
                campaignsSeen = '';
            }

            campaignsSeen = campaignsSeen.split(',');

            if (!campaignsSeen.includes(action.campaign.id)) {
                campaignsSeen.push(action.campaign.id);
                campaignsSeen = campaignsSeen.join(',');
                storage.setItem(CAMPAIGNS_SEEN_KEY, campaignsSeen);
            }

            return {
                ...state,
                displayedCampaigns: newDisplayedCampaigns,
                campaigns: newCampaigns
            };
        }

        default:
            return state;
    }
}
