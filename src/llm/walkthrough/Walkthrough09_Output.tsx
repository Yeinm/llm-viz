import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough09_Output(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Output) {
        return;
    }

    setInitialCamera(state, new Vec3(-20.203, 0.000, -1642.819), new Vec3(281.600, -7.900, 2.298));

    let c0 = commentary(wt, null, 0)`

最后，我们来到了模型的末端。最后一个 Transformer 模块的输出会先经过
一层归一化（layer normalization），然后再应用一次线性变换（矩阵乘法），这次没有偏置。

这最后一步变换会把每一列向量从长度 C 变成长度 nvocab。因此，它实际上是在
为每一列中的每个词表（vocabulary）单词产生一个分数。这些分数有一个专门的名称：
logits。

"logits" 这个名字来自 "log-odds"，即每个 token 的几率（odds）的对数。之所以用
"log"，是因为接下来要应用的 softmax 会做一次指数运算，把分数转换成"几率"或概率。

为了把这些分数转换成漂亮的概率，我们要让它们通过一次 softmax 运算。现在，每一列
都有了一个概率，表示模型认为词表中每个单词出现的可能性。

在这个特定的模型里，它其实已经学会了如何给三个字母排序这个问题的所有答案，
所以概率会高度集中在正确的答案上。

当我们逐步让模型随时间推进时，会用最后一列的概率来决定要添加到序列中的
下一个 token。例如，如果向模型输入了六个 token，我们就会使用第 6 列的输出概率。

这一列的输出是一组概率，而我们实际上必须从中选出一个来作为序列中的下一个元素。
做法是"从分布中采样（sampling from the distribution）"，即按照概率加权随机
选择一个 token。例如，概率为 0.9 的 token 会有 90% 的几率被选中。

不过这里也有其他选择，比如总是选取概率最高的那个 token。

我们还可以通过一个温度参数（temperature）来控制分布的"平滑程度"。温度越高，
分布就越均匀；温度越低，分布就越集中在概率最高的那几个 token 上。

具体做法是：在应用 softmax 之前，先把 logits（线性变换的输出）除以温度。由于
softmax 中的指数运算对较大的数影响更大，让这些数彼此更接近就能减弱这种影响。
`;

}
