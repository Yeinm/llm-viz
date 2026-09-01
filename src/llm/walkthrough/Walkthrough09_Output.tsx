import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";
import { L } from "../i18n";

export function walkthrough09_Output(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Output) {
        return;
    }

    setInitialCamera(state, new Vec3(-20.203, 0.000, -1642.819), new Vec3(281.600, -7.900, 2.298));

    let c0 = commentary(wt, null, 0)`

${L('Finally, we come to the end of the model. The output of the final transformer block is passed through a layer normalization, and then we use a linear transformation (matrix multiplication), this time without a bias.', '最后，我们来到了模型的末端。最后一个 Transformer 模块的输出会先经过一层归一化（layer normalization），然后再应用一次线性变换（矩阵乘法），这次没有偏置。')}

${L('This final transformation takes each of our column vectors from length C to length nvocab. Hence, it\'s effectively producing a score for each word in the vocabulary for each of our columns. These scores have a special name: logits.', '这最后一步变换会把每一列向量从长度 C 变成长度 nvocab。因此，它实际上是在为每一列中的每个词表（vocabulary）单词产生一个分数。这些分数有一个专门的名称：logits。')}

${L('The name "logits" comes from "log-odds," i.e., the logarithm of the odds of each token. "Log" is used because the softmax we apply next does an exponentiation to convert to "odds" or probabilities.', '"logits" 这个名字来自 "log-odds"，即每个 token 的几率（odds）的对数。之所以用 "log"，是因为接下来要应用的 softmax 会做一次指数运算，把分数转换成"几率"或概率。')}

${L('To convert these scores into nice probabilities, we pass them through a softmax operation. Now, for each column, we have a probability the model assigns to each word in the vocabulary.', '为了把这些分数转换成漂亮的概率，我们要让它们通过一次 softmax 运算。现在，每一列都有了一个概率，表示模型认为词表中每个单词出现的可能性。')}

${L('In this particular model, it has effectively learned all the answers to the question of how to sort three letters, so the probabilities are heavily weighted toward the correct answer.', '在这个特定的模型里，它其实已经学会了如何给三个字母排序这个问题的所有答案，所以概率会高度集中在正确的答案上。')}

${L('When we\'re stepping the model through time, we use the last column\'s probabilities to determine the next token to add to the sequence. For example, if we\'ve supplied six tokens into the model, we\'ll use the output probabilities of the 6th column.', '当我们逐步让模型随时间推进时，会用最后一列的概率来决定要添加到序列中的下一个 token。例如，如果向模型输入了六个 token，我们就会使用第 6 列的输出概率。')}

${L('This column\'s output is a series of probabilities, and we actually have to pick one of them to use as the next in the sequence. We do this by "sampling from the distribution." That is, we randomly choose a token, weighted by its probability. For example, a token with a probability of 0.9 will be chosen 90% of the time.', '这一列的输出是一组概率，而我们实际上必须从中选出一个来作为序列中的下一个元素。做法是"从分布中采样（sampling from the distribution）"，即按照概率加权随机选择一个 token。例如，概率为 0.9 的 token 会有 90% 的几率被选中。')}

${L('There are other options here, however, such as always choosing the token with the highest probability.', '不过这里也有其他选择，比如总是选取概率最高的那个 token。')}

${L('We can also control the "smoothness" of the distribution by using a temperature parameter. A higher temperature will make the distribution more uniform, and a lower temperature will make it more concentrated on the highest probability tokens.', '我们还可以通过一个温度参数（temperature）来控制分布的"平滑程度"。温度越高，分布就越均匀；温度越低，分布就越集中在概率最高的那几个 token 上。')}

${L('We do this by dividing the logits (the output of the linear transformation) by the temperature before applying the softmax. Since the exponentiation in the softmax has a large effect on larger numbers, making them all closer together will reduce this effect.', '具体做法是：在应用 softmax 之前，先把 logits（线性变换的输出）除以温度。由于 softmax 中的指数运算对较大的数影响更大，让这些数彼此更接近就能减弱这种影响。')}
`;

}
