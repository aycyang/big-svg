'use strict';

init();

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.left = '';
stats.dom.style.right = '0px';
document.body.appendChild( stats.dom );

function init() {
  checkboxPanAnimate.checked = false;
  checkboxShowOptions.checked = false;
  inputPanX.value = 0;
  inputPanY.value = 0;
  inputPanX.disabled = true;
  inputPanY.disabled = true;
  checkboxPanAnimate.disabled = true;
  svgContainer.innerHTML = '';
  window.scrollTo(0, 0);
}

function generateCheckerboardSVG(boardWidth, boardHeight, cellWidth, cellHeight, skip) {
  if (!skip) {
    skip = 1;
  } else {
    skip = parseInt(skip, 10);
  }
  const totalWidth = cellWidth * boardWidth;
  const totalHeight = cellHeight * boardHeight;
  const svgLines = [];
  svgLines.push(`<svg width="${totalWidth}" height="${totalHeight}" version="1.1" xmlns="http://www.w3.org/2000/svg">`);
  for (let col = 0; col < boardHeight; col += skip) {
    const y = col * cellHeight;
    for (let row = 0; row < boardWidth; row += skip) {
      const x = row * cellWidth;
      const color = (row + col) % 2 == 0 ? 'orange' : 'blue';
      const line = `<rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" fill="${color}" />`;
      svgLines.push(line);
    }
  }
  svgLines.push('</svg>');
  return [svgLines.join(''), svgLines.length - 2];
}

function generateSVG() {
  const [svgXML, numRects] = generateCheckerboardSVG(
  inputBoardWidth.value,
  inputBoardHeight.value,
  inputCellWidth.value,
  inputCellHeight.value,
  inputSkip.value);
  svgContainer.innerHTML = svgXML;
  return numRects;
}

btnGenerateSVG.addEventListener('click', (event) => {
  init();
  statusGenerateSVG.innerHTML = 'generating...';
  const start = Date.now();
  // setTimeout(fn, 0) is a hack to allow UI to update before kicking off generation procedure
  setTimeout(() => {
    const numRects = generateSVG();
    const elapsed = Date.now() - start;
    btnGenerateSVG.disabled = false;
    inputPanX.disabled = false;
    inputPanY.disabled = false;
    checkboxPanAnimate.disabled = false;
    statusGenerateSVG.innerHTML = `generated svg with ${numRects.toLocaleString()} rects in ${elapsed} millisecond(s).`;
  }, 0);
});

checkboxShowOptions.addEventListener('change', event => {
  if (checkboxShowOptions.checked) {
    svgOptions.style.display = '';
  } else {
    svgOptions.style.display = 'none';
  }
});

inputPanX.addEventListener('change', event => {
  window.scrollTo(inputPanX.value, inputPanY.value);
});

inputPanY.addEventListener('change', event => {
  window.scrollTo(inputPanX.value, inputPanY.value);
});

function mainLoop(t) {
  stats.begin();
  if (checkboxPanAnimate.checked) {
    const x = 2000 + Math.cos(t / 4000) * 2000;
    const y = 2000 + Math.sin(t / 4000) * 2000;
    inputPanX.value = Math.round(x);
    inputPanY.value = Math.round(y);
    window.scrollTo(x, y);
  }
  stats.end();
  requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
