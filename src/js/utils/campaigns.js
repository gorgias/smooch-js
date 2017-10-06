function validateCurrentUrlTrigger(trigger, currentUrl) {
    switch (trigger.operator) {
        case 'eq':
            return trigger.value === currentUrl;
        case 'neq':
            return trigger.value !== currentUrl;
        case 'contains':
            return currentUrl.includes(trigger.value);
        case 'notContains':
            return !currentUrl.includes(trigger.value);
        case 'startsWith':
            return currentUrl.startsWith(trigger.value);
        case 'endsWith':
            return currentUrl.endsWith(trigger.value);
        default:
            return false;
    }
}

function validateTimeSpentOnPage(trigger, timeSpentOnPage) {
    switch (trigger.operator) {
        case 'gt':
            return timeSpentOnPage >= trigger.value;
        default:
            return false;
    }
}

export function shouldDisplayCampaign(campaign, context) {
    let shouldDisplay = true;
    const triggers = campaign.triggers;

    triggers.forEach((trigger) => {
        if (trigger.key === 'current_url') {
            shouldDisplay = shouldDisplay && validateCurrentUrlTrigger(trigger, context.currentUrl);
        } else if (trigger.key === 'time_spent_on_page') {
            shouldDisplay = shouldDisplay && validateTimeSpentOnPage(trigger, context.timeSpentOnPage);
        }
    });

    return shouldDisplay;
}
