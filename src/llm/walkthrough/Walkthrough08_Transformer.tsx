import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough08_Transformer(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Transformer) {
        return;
    }

    setInitialCamera(state, new Vec3(-135.531, 0.000, -353.905), new Vec3(291.100, 13.600, 5.706));

    let c0 = commentary(wt, null, 0)`

这就是一个完整的 Transformer 模块（transformer block）！

这些模块构成了任何 GPT 模型的主体，并且会被重复堆叠多次：一个模块的输出
作为下一个模块的输入，残差通路（residual pathway）贯穿始终。

与深度学习（deep learning）中的常见情况一样，我们很难准确说出每一层到底在做什么，但大致
有一些思路：较早的层倾向于学习较低层级的特征和模式，而较后的层则学会识别和理解
更高层级的抽象与关系。在自然语言处理（natural language processing）的语境下，
较低的层可能学习语法、句法和简单的词与词之间的关联，而较高的层则可能捕捉更复杂的
语义关系、篇章结构和依赖上下文的含义。

`;

}
