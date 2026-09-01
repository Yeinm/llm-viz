import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";
import { L } from "../i18n";

export function walkthrough08_Transformer(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Transformer) {
        return;
    }

    setInitialCamera(state, new Vec3(-135.531, 0.000, -353.905), new Vec3(291.100, 13.600, 5.706));

    let c0 = commentary(wt, null, 0)`

${L('And that\'s a complete transformer block!', '这就是一个完整的 Transformer 模块（transformer block）！')}

${L('These form the bulk of any GPT model and are repeated a number of times, with the output of one block feeding into the next, continuing the residual pathway.', '这些模块构成了任何 GPT 模型的主体，并且会被重复堆叠多次：一个模块的输出作为下一个模块的输入，残差通路（residual pathway）贯穿始终。')}

${L('As is common in deep learning, it\'s hard to say exactly what each of these layers is doing, but we have some general ideas: the earlier layers tend to focus on learning lower-level features and patterns, while the later layers learn to recognize and understand higher-level abstractions and relationships. In the context of natural language processing, the lower layers might learn grammar, syntax, and simple word associations, while the higher layers might capture more complex semantic relationships, discourse structures, and context-dependent meaning.', '与深度学习（deep learning）中的常见情况一样，我们很难准确说出每一层到底在做什么，但大致有一些思路：较早的层倾向于学习较低层级的特征和模式，而较后的层则学会识别和理解更高层级的抽象与关系。在自然语言处理（natural language processing）的语境下，较低的层可能学习语法、句法和简单的词与词之间的关联，而较高的层则可能捕捉更复杂的语义关系、篇章结构和依赖上下文的含义。')}

`;

}
