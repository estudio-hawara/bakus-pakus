export const defaultStyle: string = `

svg {
    background-color: hsl(30,20%,95%);
}

path {
    stroke-width: 3;
    stroke: black;
    fill: rgba(0,0,0,0);
}

text {
    font: bold 14px monospace;
    text-anchor: middle;
    white-space: pre;
}

text.diagram-text {
    font-size: 12px;
}

text.diagram-arrow {
    font-size: 16px;
}

text.label {
    text-anchor: start;
}

text.comment {
    font: italic 12px monospace;
}

rect {
    stroke-width: 3;
    stroke: black;
    fill: hsl(120,100%,90%);
}

rect.group-box {
    stroke: gray;
    stroke-dasharray: 10 5;
    fill: none;
}

path.diagram-text {
    stroke-width: 3;
    stroke: black;
    fill: white;
    cursor: help;
}

g.diagram-text:hover path.diagram-text {
    fill: #eee;
}

`;
