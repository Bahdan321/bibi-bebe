// Example: How to use the enhanced CustomText component with localization

import React from 'react';
import CustomText from '@/components/base/CustomText';
import { useTranslation } from 'react-i18next';

// Method 1: Using translationKey prop (Recommended)
const LocalizedComponentExample = () => {
    return (
        <div>
            {/* Using translation key directly */}
            <CustomText
                translationKey="settings.language"
                size="lg"
                color="#000"
                weight="bold"
            />

            {/* Using translation key with variables */}
            <CustomText
                translationKey="common.welcome"
                translationOptions={{ name: "John" }}
                size="md"
            />

            {/* Fallback to content if translationKey is not provided */}
            <CustomText
                content="Fallback text"
                size="sm"
            />
        </div>
    );
};

// Method 2: Using useTranslation hook directly
const DirectTranslationExample = () => {
    const { t } = useTranslation();

    return (
        <CustomText
            content={t('settings.theme')}
            size="lg"
            weight="bold"
        />
    );
};

// Method 3: Using our custom hook
import { useTranslatedText } from '@/hooks/useTranslatedText';

const CustomHookExample = () => {
    const { getText } = useTranslatedText();

    return (
        <CustomText
            content={getText('profile.title')}
            size="xl"
            color="#333"
        />
    );
};

// How to migrate existing components:

// BEFORE:
// <CustomText content="Язык" size="md" />

// AFTER (Option 1 - Recommended):
// <CustomText translationKey="settings.language" size="md" />

// AFTER (Option 2):
// <CustomText content={t('settings.language')} size="md" />

export { LocalizedComponentExample, DirectTranslationExample, CustomHookExample };