import React from 'react';
import { LayerView } from '@/src/llm/LayerView';
import { InfoButton } from '@/src/llm/WelcomePopup';

export const metadata = {
  title: 'LLM 可视化',
  description: '带逐步讲解的 LLM 3D 动画可视化。',
};

import { Header } from '@/src/homepage/Header';

export default function Page() {
    return <>
        <Header title="LLM 可视化">
            <InfoButton />
        </Header>
        <LayerView />
        <div id="portal-container"></div>
    </>;
}
