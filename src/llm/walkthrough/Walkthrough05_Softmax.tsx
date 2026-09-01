import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough05_Softmax(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Softmax) {
        return;
    }

    setInitialCamera(state, new Vec3(-24.350, 0.000, -1702.195), new Vec3(283.100, 0.600, 1.556));

    let c0 = commentary(wt, null, 0)`

Softmax 操作是自注意力（Self-Attention）的一部分，正如上一节所看到的，它也会出现在模型的最末端。

它的目标是对一个向量进行归一化，使其各值之和为 1.0。不过，它并不像直接除以总和那么简单。相反，每个输入值都要先进行指数运算。

  a = exp(x_1)

这会产生让所有值都变为正数的效果。一旦我们得到指数化后的向量，就可以用每个值除以所有值的总和。这样就能保证所有值之和为 1.0。由于指数化后的值都是正数，我们知道最终得到的值会介于 0.0 和 1.0 之间，从而在原始值之上形成一个概率分布。

Softmax 就这么简单：对值取指数，再除以总和即可。

不过，这里有个小小的复杂之处。如果某个输入值相当大，那么指数化后的值就会非常大。我们会用一个大数除以一个更大的数，这可能会在浮点运算中引发问题。

Softmax 操作有一个有用的性质：如果给所有输入值加上一个常数，结果保持不变。因此我们可以先找出输入向量中的最大值，再将其从所有值中减去。这样就能保证最大值为 0.0，使 Softmax 在数值上保持稳定。

接下来，我们来看看 Softmax 操作在自注意力层中的实际应用。每次 Softmax 操作的输入向量，都是自注意力矩阵（Attention Matrix）中的一行（但只到对角线为止）。

与层归一化（Layer Normalization）类似，我们有一个中间步骤，用来存储一些聚合值，以保持整个过程的高效。

对于每一行，我们都会存储该行的最大值，以及平移与指数化后的值的总和。然后，要生成对应的输出行，我们只需执行一小套运算：减去最大值、取指数、再除以总和。

「softmax」这个名字是怎么来的？这个操作的「硬」版本叫做 argmax，它只是找出最大值、将其设为 1.0，并把其余所有值设为 0.0。相比之下，softmax 操作相当于它的「软」版本。由于 softmax 中涉及指数运算，最大的值会被放大并推向 1.0，同时仍然在整个输入值上维持一个概率分布。这使得它可以表达更细腻的信息，不仅捕获最可能的结果，也保留了其他选项的相对可能性。
`;

}
