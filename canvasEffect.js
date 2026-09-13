export function initCanvasEffect() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  // 1. Setup the hidden video element
  const video = document.createElement('video');
  video.src = '/video.mp4';
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.style.display = 'none';
  document.body.appendChild(video);

  // 2. Setup the visible canvas where we draw lines
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  // 3. Setup an offscreen canvas to read raw pixel data
  const offscreenCanvas = document.createElement('canvas');
  const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

  // Handle resizing
  let width, height;
  function resize() {
    // Make canvas fill the container
    width = container.clientWidth;
    height = container.clientHeight;
    
    // Maintain a 16:9 aspect ratio or whatever looks best, but for now we'll match container
    canvas.width = width;
    canvas.height = height;
    
    // The offscreen canvas can be much smaller for better performance!
    // We don't need 4K resolution to read brightness for thick lines.
    offscreenCanvas.width = 100; // 100 columns of resolution
    offscreenCanvas.height = 100;
  }
  window.addEventListener('resize', resize);
  resize();

  // 4. The Render Loop
  const COLUMNS = 80; // How many vertical lines to draw across the screen
  
  function draw() {
    if (video.readyState >= 2) {
      // Clear the visible canvas
      ctx.clearRect(0, 0, width, height);

      // Draw the current video frame to the offscreen canvas (scaled down)
      offscreenCtx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

      // Get the pixel data from the offscreen canvas
      const frameData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height).data;

      // Calculate dimensions on the visible canvas
      const colWidth = width / COLUMNS;
      const ROWS = Math.floor(height / (colWidth)); // Keep square-ish sampling cells for accuracy
      const rowHeight = height / ROWS;

      // Set line style
      ctx.fillStyle = '#c09d73'; // Our premium accent color (Bronze/Gold)

      for (let x = 0; x < COLUMNS; x++) {
        const offscreenX = Math.floor((x / COLUMNS) * offscreenCanvas.width);
        
        for (let y = 0; y < ROWS; y++) {
           const offscreenY = Math.floor((y / ROWS) * offscreenCanvas.height);
           const index = (offscreenY * offscreenCanvas.width + offscreenX) * 4;
           const r = frameData[index];
           const g = frameData[index + 1];
           const b = frameData[index + 2];
           
           // Simple perceived brightness formula
           const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
           
           // The thickness of the line segment depends on the brightness
           let lineWidth = brightness * colWidth * 0.9;
           
           // If it's pure black (background), we don't draw anything to save performance
           // and keep the premium black void look.
           if (lineWidth > 0.5) {
             const xPos = (x * colWidth) + (colWidth / 2) - (lineWidth / 2);
             const yPos = y * rowHeight;
             
             // Draw the vertical line segment
             // We make it 1px taller than rowHeight to avoid tiny gaps between segments
             ctx.fillRect(xPos, yPos, lineWidth, rowHeight + 1);
           }
        }
      }
    }
    requestAnimationFrame(draw);
  }

  // Start the loop
  draw();
}
