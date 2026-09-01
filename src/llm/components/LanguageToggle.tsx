import React, { useState } from 'react';
import s from './LanguageToggle.module.scss';
import { getLanguage, setLanguage, Language } from '../i18n';
import { useProgramState } from '../Sidebar';

export const LanguageToggle: React.FC = () => {
    const progState = useProgramState();
    const [lang, setLang] = useState<Language>(getLanguage());

    function handleToggle() {
        const next: Language = getLanguage() === 'en' ? 'zh' : 'en';
        setLanguage(next);
        setLang(next);
        // The walkthrough re-evaluates its text every frame, so a single dirty
        // pass is enough to switch the commentary and the 3D labels.
        progState.markDirty();
    }

    return (
        <div className={s.wrap} title={lang === 'en' ? 'Switch to 中文' : 'Switch to English'}>
            <button
                className={s.btn}
                onClick={handleToggle}
                aria-label="Language / 语言"
            >
                {lang === 'en' ? '中文' : 'EN'}
            </button>
        </div>
    );
};
