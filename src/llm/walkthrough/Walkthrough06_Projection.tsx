import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, DimStyle, IWalkthroughArgs, moveCameraTo, setInitialCamera } from "./WalkthroughTools";
import { lerp, lerpSmoothstep } from "@/src/utils/math";
import { processUpTo, startProcessBefore } from "./Walkthrough00_Intro";

export function walkthrough06_Projection(args: IWalkthroughArgs) {
    let { walkthrough: wt, state, layout, tools: { breakAfter, afterTime, c_blockRef, c_dimRef, cleanup } } = args;

    if (wt.phase !== Phase.Input_Detail_Projection) {
        return;
    }

    setInitialCamera(state, new Vec3(-73.167, 0.000, -270.725), new Vec3(293.606, 2.613, 1.366));
    let block = layout.blocks[0];
    wt.dimHighlightBlocks = [...block.heads.map(h => h.vOutBlock), block.projBias, block.projWeight, block.attnOut];

    let outBlocks = block.heads.map(h => h.vOutBlock);

    commentary(wt, null, 0)`

在自注意力（Self-Attention）过程之后，我们会得到来自每个头的输出。这些输出是经过恰当混合的 V 向量，同时受到了 Q 向量和 K 向量的影响。

要将每个头的 ${c_blockRef('输出向量', outBlocks)} 组合起来，我们只需把它们上下堆叠在一起。因此，在时刻
${c_dimRef('t = 4', DimStyle.T)}，我们从 3 个长度为 ${c_dimRef('A = 16', DimStyle.A)} 的向量，得到 1 个长度为 ${c_dimRef('C = 48', DimStyle.C)} 的向量。`;

    breakAfter();

    let t_fadeOut = afterTime(null, 1.0, 0.5);
    // let t_zoomToStack = afterTime(null, 1.0);
    let t_stack = afterTime(null, 1.0);

    breakAfter();

    commentary(wt)`

值得一提的是，在 GPT 中，单个头内向量的长度（${c_dimRef('A = 16', DimStyle.A)}）等于 ${c_dimRef('C', DimStyle.C)} / num_heads。
这保证了当我们把它们重新堆叠起来时，能够得到原始的长度 ${c_dimRef('C', DimStyle.C)}。

从这里开始，我们执行投影（Projection）以获得这一层的输出。这是一个逐列进行的简单矩阵-向量
乘法，并加上偏置。`;

    breakAfter();

    let t_process = afterTime(null, 3.0);

    breakAfter();

    commentary(wt)`

现在我们得到了自注意力层的输出。与其把这个输出直接传给下一个阶段，我们把它逐元素地加到输入嵌入上。这个过程，用绿色
垂直箭头表示，被称为_残差连接（Residual Connection）_或_残差通路_。
`;

    breakAfter();

    let t_zoomOut = afterTime(null, 1.0, 0.5);
    let t_processResid = afterTime(null, 3.0);

    cleanup(t_zoomOut, [t_fadeOut, t_stack]);

    breakAfter();

    commentary(wt)`

与层归一化（Layer Normalization）类似，残差通路对于在深层
神经网络中实现有效学习至关重要。

现在，我们已经得到了自注意力的结果，可以把它传给 Transformer 的下一个部分：
前馈网络（Feed-Forward Network）。
`;

    breakAfter();

    if (t_fadeOut.active) {
        for (let head of block.heads) {
            for (let blk of head.cubes) {
                if (blk !== head.vOutBlock) {
                    blk.opacity = lerpSmoothstep(1, 0, t_fadeOut.t);
                }
            }
        }
    }

    if (t_stack.active) {
        let targetZ = block.attnOut.z;
        for (let headIdx = 0; headIdx < block.heads.length; headIdx++) {
            let head = block.heads[headIdx];
            let targetY = head.vOutBlock.y + head.vOutBlock.dy * (headIdx - block.heads.length + 1);
            head.vOutBlock.y = lerp(head.vOutBlock.y, targetY, t_stack.t);
            head.vOutBlock.z = lerp(head.vOutBlock.z, targetZ, t_stack.t);
        }
    }

    let processInfo = startProcessBefore(state, block.attnOut);

    if (t_process.active) {
        processUpTo(state, t_process, block.attnOut, processInfo);
    }

    moveCameraTo(state, t_zoomOut, new Vec3(-8.304, 0.000, -175.482), new Vec3(293.606, 2.623, 2.618));

    if (t_processResid.active) {
        processUpTo(state, t_processResid, block.attnResidual, processInfo);
    }
}
