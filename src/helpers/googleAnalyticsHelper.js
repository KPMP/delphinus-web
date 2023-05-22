import { default as ReactGA4 } from 'react-ga4';

export const handleGoogleAnalyticsEvent = (category, action, label) => {
    ReactGA4.event({
        category: category,
        action: action,
        label: label
    });
}