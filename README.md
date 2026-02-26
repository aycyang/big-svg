# BigSVG

This is a page for testing web browser scrolling performance on large SVGs with lots of elements.

I had some large generated SVGs I needed to browse and found a pretty noticeable difference in `window.scrollTo()` performance between major browsers (I tested Chromium, Firefox and Safari). For further study, I've developed this minimal reproduction.

## Instructions

1. Click the 'generate svg' button. Give it a few seconds.
2. Click the 'animate' checkbox.

Using `requestAnimationFrame()` and `window.scrollTo()`, the page will slowly pan around the SVG in a circle.

## Observations

- Overall, at the time of writing, Firefox (version 147.0.4) and Safari (version 26.3) do a lot better than Chromium (version 145.0.7632.111). On my base-spec M4 MacBook Pro, with default SVG generation settings (1000x1000 checkerboard, with cell size set to 100px), Safari averages 60 FPS, Firefox hangs around 45 FPS, and Chromium hangs around 10 FPS.
- I observed similar performance on Chromium and Firefox on both macOS and Windows.
- Firefox and Chromium do a little better when the viewport is made smaller. This seems reasonable.
- All browsers do a lot worse when the mouse is hovered over the SVG element. This could be related to how compositing is implemented, but I am largely unable to explain this.
- Normal scrolling with the trackpad is extremely smooth. This could be related to how hardware acceleration is used for certain kinds of scrolling, but I am largely unable to explain this.
- If I change the SVG generation settings so that almost all of the rectangles are visible in the viewport (setting cell size to 1), Firefox performance drops down to 1 FPS. Chromium and Safari remain about the same. This suggests to me that Firefox's apparent improvement over Chromium comes from some sort of culling.
