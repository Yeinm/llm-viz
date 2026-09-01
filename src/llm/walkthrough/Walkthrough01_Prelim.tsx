import React from 'react';
import { L } from "../i18n";
import { Phase } from "./Walkthrough";
import { commentary, embed, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";
import s from './Walkthrough.module.scss';
import { Vec3 } from '@/src/utils/vector';

let minGptLink = 'https://github.com/karpathy/minGPT';
let pytorchLink = 'https://pytorch.org/';
let andrejLink = 'https://karpathy.ai/';
let zeroToHeroLink = 'https://karpathy.ai/zero-to-hero.html';

export function walkthrough01_Prelim(args: IWalkthroughArgs) {
    let { state, walkthrough: wt } = args;

    if (wt.phase !== Phase.Intro_Prelim) {
        return;
    }

    setInitialCamera(state, new Vec3(184.744, 0.000, -636.820), new Vec3(296.000, 16.000, 13.500));

    let c0 = commentary(wt, null, 0)`
${L('Before we delve into the algorithm\'s intricacies, let\'s take a brief step back.', '在深入探究算法的各种细节之前，让我们先退后一步，简要了解一下背景。')}

${L('This guide focuses on _inference_, not training, and as such is only a small part of the entire machine-learning process.', '本指南专注于_推理（Inference）_而非训练（Training），因此它只是整个机器学习（Machine Learning）过程中的一小部分。')}
${L('In our case, the model\'s weights have been pre-trained, and we use the inference process to generate output. This runs directly in your browser.', '就我们的情况而言，模型的权重已经过预训练，我们通过推理过程来生成输出，这一切都直接在你的浏览器中运行。')}

${L('The model showcased here is part of the GPT (generative pre-trained transformer) family, which can be described as a "context-based token predictor".', '这里展示的模型属于 GPT（Generative Pre-trained Transformer，生成式预训练变换器）家族，可以将其描述为一个「基于上下文的词元预测器」。')}
${L('OpenAI introduced this family in 2018, with notable members such as GPT-2, GPT-3, and GPT-3.5 Turbo, the latter being the foundation of the widely-used ChatGPT.', 'OpenAI 于 2018 年推出了这一家族，其知名成员包括 GPT-2、GPT-3 和 GPT-3.5 Turbo，其中后者正是广受欢迎的 ChatGPT 的基础。')}
${L('It might also be related to GPT-4, but specific details remain unknown.', '它可能也与 GPT-4 相关，但具体细节尚不为人知。')}

${L('This guide was inspired by the ', '本指南的灵感来源于 ')}${embedLink('minGPT', minGptLink)}${L(' GitHub project, a minimal GPT implementation in ', ' GitHub 项目——一个用 ')}${embedLink('PyTorch', pytorchLink)}
${L('created by ', '由 ')}${embedLink('Andrej Karpathy', andrejLink)}${L('.', ' 创建。')}
${L('His YouTube series ', '他的 YouTube 系列视频 ')}${embedLink("Neural Networks: Zero to Hero", zeroToHeroLink)}${L(' and the minGPT project have been invaluable resources in the creation of this', ' 以及 minGPT 项目，在编写本指南的过程中提供了极其宝贵的资料。')}
${L('guide. The toy model featured here is based on one found within the minGPT project.', '这里展示的玩具模型正是基于 minGPT 项目中的一个模型。')}

${L('Alright, let\'s get started!', '好了，让我们开始吧！')}
`;

}

export function embedLink(a: React.ReactNode, href: string) {
    return embedInline(<a className={s.externalLink} href={href} target="_blank" rel="noopener noreferrer">{a}</a>);
}

export function embedInline(a: React.ReactNode) {
    return { insertInline: a };
}


// Another similar model is BERT (bidirectional encoder representations from transformers), a "context-aware text encoder" commonly
// used for tasks like document classification and search.  Newer models like Facebook's LLaMA (large language model architecture), continue to use
// a similar transformer architecture, albeit with some minor differences.
