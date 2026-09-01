import { duplicateGrid, splitGrid } from "../Annotations";
import { L } from "../i18n";
import { getBlockValueAtIdx } from "../components/DataFlow";
import { IBlkDef } from "../GptModelLayout";
import { drawText, IFontOpts, measureText } from "../render/fontRender";
import { lerp } from "@/src/utils/math";
import { Mat4f } from "@/src/utils/matrix";
import { Dim, Vec3, Vec4 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, DimStyle, IWalkthroughArgs, moveCameraTo, setInitialCamera } from "./WalkthroughTools";
import { processUpTo, startProcessBefore } from "./Walkthrough00_Intro";

export function walkthrough02_Embedding(args: IWalkthroughArgs) {
    let { walkthrough: wt, state, tools: { c_str, c_blockRef, c_dimRef, afterTime, cleanup, breakAfter }, layout } = args;
    let render = state.render;

    if (wt.phase !== Phase.Input_Detail_Embedding) {
        return;
    }

    setInitialCamera(state, new Vec3(15.654, 0.000, -80.905), new Vec3(287.000, 14.500, 3.199));
    wt.dimHighlightBlocks = [layout.idxObj, layout.tokEmbedObj, layout.posEmbedObj, layout.residual0];

    commentary(wt)`
${L('We saw previously how the tokens are mapped to a sequence of integers using a simple lookup table.', '我们之前已经看到，词元是如何通过一张简单的查找表（lookup table）被映射为整数序列的。')}
${L('These integers, the ', '这些整数，即 ')}${c_blockRef(L('_token indices_', '_词元索引_'), state.layout.idxObj, DimStyle.TokenIdx)}${L(', are the first and only time we see integers in the model.', '，是我们在模型中第一次也是唯一一次看到整数。')}
${L('From here on out, we\'re using floats (decimal numbers).', '从此以后，我们将全部使用浮点数（小数）。')}

${L('Let\'s take a look at how the 4th token (index 3) is used to generate the 4th column vector of our ', '让我们看看第 4 个词元（索引为 3）是如何被用来生成 ')}${c_blockRef(L('_input embedding_', '_输入嵌入（Input Embedding）_'), state.layout.residual0)}${L('.', ' 的第 4 列向量的。')}`;
    breakAfter();

    let t_moveCamera = afterTime(null, 1.0);
    let t0_splitEmbedAnim = afterTime(null, 0.3);

    breakAfter();

    commentary(wt)`
${L('We use the token index (in this case ', '我们使用词元索引（这里 ')}${c_str('B', DimStyle.Token)}${L(' = ', ' = ')}${c_dimRef('1', DimStyle.TokenIdx)}${L(') to select the 2nd column of the ', '）来选择左侧 ')}${c_blockRef(L('_token embedding matrix_', '_词元嵌入矩阵_'), state.layout.tokEmbedObj)}${L(' on the left.', ' 的第 2 列。')}
${L('Note we\'re using 0-based indexing here, so the first column is at index 0.', '请注意，这里使用的是从 0 开始的索引，所以第 1 列位于索引 0。')}

${L('This produces a column vector of size ', '这会生成一个大小为 ')}${c_dimRef('_C_ = 48', DimStyle.C)}${L(', which we describe as the token embedding.', ' 的列向量，我们称之为词元嵌入（Token Embedding）。')}
    `;
    breakAfter();

    let t1_fadeEmbedAnim = afterTime(null, 0.3);
    let t2_highlightTokenEmbed = afterTime(null, 0.8);

    breakAfter();

    commentary(wt)`
${L('And since we\'re looking at our token ', '既然我们观察的是位于第 4 个 _位置（Position）_ 处的词元 ')}${c_str('B', DimStyle.Token)}${L(' in the 4th _position_ (t = ', '（t = ')}${c_dimRef('3', DimStyle.T)}${L('), we\'ll take the 4th column of the ', '），我们将取 ')}${c_blockRef(L('_position embedding matrix_', '_位置嵌入矩阵_'), state.layout.posEmbedObj)}${L('.', ' 的第 4 列。')}

${L('This also produces a column vector of size ', '同样，这也会生成一个大小为 ')}${c_dimRef('_C_ = 48', DimStyle.C)}${L(', which we describe as the position embedding.', ' 的列向量，我们称之为位置嵌入（Position Embedding）。')}
    `;
    breakAfter();

    let t4_highlightPosEmbed = afterTime(null, 0.8);

    breakAfter();

    commentary(wt)`
${L('Note that both of these position and token embeddings are learned during training (indicated by their blue color).', '请注意，位置嵌入和词元嵌入都是在训练过程中学习得到的（这一点由它们的蓝色表示）。')}

${L('Now that we have these two column vectors, we simply add them together to produce another column vector of size ', '现在我们已经有了这两个列向量，只需将它们相加，就能得到另一个大小为 ')}${c_dimRef('_C_ = 48', DimStyle.C)}${L('.', ' 的列向量。')}
`;

    breakAfter();

    let t3_moveTokenEmbed = afterTime(null, 0.8);
    let t5_movePosEmbed = afterTime(null, 0.8);
    let t6_plusSymAnim = afterTime(null, 0.8);
    let t7_addAnim = afterTime(null, 0.8);
    let t8_placeAnim = afterTime(null, 0.8);
    let t9_cleanupInstant = afterTime(null, 0.0);
    let t10_fadeAnim = afterTime(null, 0.8);

    breakAfter();

    commentary(wt)`
${L('We now run this same process for all of the tokens in the input sequence, creating a set of vectors which incorporate both the token values and their positions.', '现在，我们对输入序列中的所有词元重复同样的过程，得到一组既包含词元值、又包含其位置的向量。')}

`;

    breakAfter();

    let t11_fillRest = afterTime(null, 5.0);

    breakAfter();

    commentary(wt)`
${L('Feel free to hover over individual cells on the ', '你可以随时将鼠标悬停在 ')}${c_blockRef(L('_input embedding_', '_输入嵌入_'), state.layout.residual0)}${L(' matrix to see the computations and their sources.', ' 矩阵的各个单元格上，查看相应的计算过程及其数据来源。')}

${L('We see that running this process for all the tokens in the input sequence produces a matrix of size ', '我们看到，对输入序列中的所有词元重复这一过程，会得到一个大小为 ')}${c_dimRef('_T_', DimStyle.T)}${L(' x ', ' x ')}${c_dimRef('_C_', DimStyle.C)}${L('.', ' 的矩阵。')}
${L('The ', '其中 ')}${c_dimRef('_T_', DimStyle.T)}${L(' stands for ', ' 代表 ')}${c_dimRef(L('_time_', '_时间（time）_'), DimStyle.T)}${L(', i.e., you can think of tokens later in the sequence as later in time.', '，也就是说，你可以把序列中靠后的词元理解为时间上更靠后。')}
${L('The ', '而 ')}${c_dimRef('_C_', DimStyle.C)}${L(' stands for ', ' 代表 ')}${c_dimRef(L('_channel_', '_通道（channel）_'), DimStyle.C)}${L(', but is also referred to as "feature" or "dimension" or "embedding size". This length, ', '，但它也被称为「特征（feature）」「维度（dimension）」或「嵌入大小（embedding size）」。这个长度 ')}${c_dimRef('_C_', DimStyle.C)}${L(',', '，')}
${L('is one of the several "hyperparameters" of the model, and is chosen by the designer to in a tradeoff between model size and performance.', '是模型的若干「超参数（hyperparameter）」之一，由设计者在模型大小与性能之间权衡后选定。')}

${L('This matrix, which we\'ll refer to as the ', '这个矩阵，也就是我们所说的 ')}${c_blockRef(L('_input embedding_', '_输入嵌入_'), state.layout.residual0)}${L(' is now ready to be passed down through the model.', '，现在可以向下传入模型了。')}
${L('This collection of ', '这种由 ')}${c_dimRef('T', DimStyle.T)}${L(' columns each of length ', ' 列组成、每列长度为 ')}${c_dimRef('C', DimStyle.C)}${L(' will become a familiar sight throughout this guide.', ' 的集合，将会在本指南中反复出现，成为你熟悉的景象。')}
`;

    cleanup(t9_cleanupInstant, [t3_moveTokenEmbed, t5_movePosEmbed, t6_plusSymAnim, t7_addAnim, t8_placeAnim]);
    cleanup(t10_fadeAnim, [t0_splitEmbedAnim, t1_fadeEmbedAnim, t2_highlightTokenEmbed, t4_highlightPosEmbed]);

    moveCameraTo(state, t_moveCamera, new Vec3(7.6, 0, -33.1), new Vec3(290, 15.5, 0.8));

    let residCol: IBlkDef = null!;
    let exampleIdx = 3;
    if ((t0_splitEmbedAnim.t > 0.0 || t10_fadeAnim.t > 0.0) && t11_fillRest.t === 0) {
        splitGrid(layout, layout.idxObj, Dim.X, exampleIdx + 0.5, t0_splitEmbedAnim.t * 4.0);

        layout.residual0.access!.disable = true;
        layout.residual0.opacity = lerp(1.0, 0.1, t1_fadeEmbedAnim.t);

        residCol = splitGrid(layout, layout.residual0, Dim.X, exampleIdx + 0.5, t0_splitEmbedAnim.t * 4.0)!;
        residCol.highlight = 0.3;

        residCol.opacity = lerp(1.0, 0.0, t1_fadeEmbedAnim.t);

    }

    let tokValue = getBlockValueAtIdx(layout.idxObj, new Vec3(exampleIdx, 0, 0)) ?? 1;


    let tokColDupe: IBlkDef | null = null;
    let posColDupe: IBlkDef | null = null;

    if (t2_highlightTokenEmbed.t > 0.0) {
        let tokEmbedCol = splitGrid(layout, layout.tokEmbedObj, Dim.X, tokValue + 0.5, t2_highlightTokenEmbed.t * 4.0)!;

        tokColDupe = duplicateGrid(layout, tokEmbedCol);
        tokColDupe.t = 'i';
        tokEmbedCol.highlight = 0.3;

        let startPos = new Vec3(tokEmbedCol.x, tokEmbedCol.y, tokEmbedCol.z);
        let targetPos = new Vec3(residCol.x, residCol.y, residCol.z).add(new Vec3(-2.0, 0, 3.0));

        let pos = startPos.lerp(targetPos, t3_moveTokenEmbed.t);

        tokColDupe.x = pos.x;
        tokColDupe.y = pos.y;
        tokColDupe.z = pos.z;
    }


    if (t4_highlightPosEmbed.t > 0.0) {
        let posEmbedCol = splitGrid(layout, layout.posEmbedObj, Dim.X, exampleIdx + 0.5, t4_highlightPosEmbed.t * 4.0)!;

        posColDupe = duplicateGrid(layout, posEmbedCol);
        posColDupe.t = 'i';
        posEmbedCol.highlight = 0.3;

        let startPos = new Vec3(posEmbedCol.x, posEmbedCol.y, posEmbedCol.z);
        let targetPos = new Vec3(residCol.x, residCol.y, residCol.z).add(new Vec3(2.0, 0, 3.0));

        let pos = startPos.lerp(targetPos, t5_movePosEmbed.t);

        posColDupe.x = pos.x;
        posColDupe.y = pos.y;
        posColDupe.z = pos.z;
    }

    if (t6_plusSymAnim.t > 0.0 && tokColDupe && posColDupe && t7_addAnim.t < 1.0) {
        for (let c = 0; c < layout.shape.C; c++) {
            let plusCenter = new Vec3(
                (tokColDupe.x + tokColDupe.dx + posColDupe.x) / 2,
                tokColDupe.y + layout.cell * (c + 0.5),
                tokColDupe.z + tokColDupe.dz / 2);

            let isActive = t6_plusSymAnim.t > (c + 1) / layout.shape.C;
            let opacity = lerp(0.0, 1.0, isActive ? 1 : 0);

            let fontOpts: IFontOpts = { color: new Vec4(0, 0, 0, 1).mul(opacity), size: 1.5, mtx: Mat4f.fromTranslation(plusCenter) };
            let w = measureText(render.modelFontBuf, '+', fontOpts);

            drawText(render.modelFontBuf, '+', -w/2, -fontOpts.size/2, fontOpts);
        }
    }

    let origResidPos = residCol ? new Vec3(residCol.x, residCol.y, residCol.z) : new Vec3();
    let offsetResidPos = origResidPos.add(new Vec3(0.0, 0, 3.0));

    if (t7_addAnim.t > 0.0 && tokColDupe && posColDupe) {
        let targetPos = offsetResidPos;
        let tokStartPos = new Vec3(tokColDupe.x, tokColDupe.y, tokColDupe.z);
        let posStartPos = new Vec3(posColDupe.x, posColDupe.y, posColDupe.z);

        let tokPos = tokStartPos.lerp(targetPos, t7_addAnim.t);
        let posPos = posStartPos.lerp(targetPos, t7_addAnim.t);

        tokColDupe.x = tokPos.x;
        tokColDupe.y = tokPos.y;
        tokColDupe.z = tokPos.z;
        posColDupe.x = posPos.x;
        posColDupe.y = posPos.y;
        posColDupe.z = posPos.z;

        if (t7_addAnim.t > 0.95) {
            tokColDupe.opacity = 0.0;
            posColDupe.opacity = 0.0;
            residCol.opacity = 1.0;
            residCol.highlight = 0.0;
            residCol.access!.disable = false;
            residCol.x = targetPos.x;
            residCol.y = targetPos.y;
            residCol.z = targetPos.z;
        }
    }

    if (t8_placeAnim.t > 0.0) {
        let startPos = offsetResidPos;
        let targetPos = origResidPos;
        let pos = startPos.lerp(targetPos, t8_placeAnim.t);
        residCol.x = pos.x;
        residCol.y = pos.y;
        residCol.z = pos.z;
    }

    if (t9_cleanupInstant.t > 0.0 && residCol) {
        residCol.opacity = 1.0;
        residCol.highlight = 0.0;
        residCol.access!.disable = false;
    }

    if (t11_fillRest.t > 0.0) {
        layout.residual0.access!.disable = true;

        let prevInfo = startProcessBefore(state, layout.residual0);
        processUpTo(state, t11_fillRest, layout.residual0, prevInfo);
    }
    // new Vec3(-6.9, 0, -36.5), new Vec3(281.5, 5.5, 0.8)
}
