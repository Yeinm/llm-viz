import React from 'react';
import { LayerView } from '@/src/llm/LayerView';
import { InfoButton } from '@/src/llm/WelcomePopup';
import { L } from "@/src/llm/i18n";

export const metadata = {
  title: L('LLM Visualization', 'LLM 可视化'),
  description: L('A 3D animated visualization of an LLM with a walkthrough.', '带逐步讲解的 LLM 3D 动画可视化。'),
};

import { Header } from '@/src/homepage/Header';

export default function Page() {
    return <>
        <Header title={L('LLM Visualization', 'LLM 可视化')}>
            <InfoButton />
        </Header>
        <LayerView />
        <div id="portal-container"></div>
    </>;
}
