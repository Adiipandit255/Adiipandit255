const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const README_PATH = (() => {
    const paths = [
        path.join(__dirname, 'Adiipandit255', 'README.md'),
        path.join(__dirname, 'README.md'),
        path.join(__dirname, 'Adiipandit255-main', 'README.md')
    ];
    for (const p of paths) {
        if (fs.existsSync(p)) return p;
    }
    return paths[0]; // default fallback
})();


function generateSnakeSVG() {
    let rects = '';
    const cols = 53;
    const rows = 7;
    const size = 10;
    const gap = 3;
    const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
    
    // Seeded random helper to make the grid look consistent
    let seed = 12345;
    function random() {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const x = c * (size + gap);
            const y = r * (size + gap);
            const rand = random();
            const colorIdx = rand < 0.6 ? 0 : (rand < 0.8 ? 1 : (rand < 0.9 ? 2 : (rand < 0.97 ? 3 : 4)));
            const color = colors[colorIdx];
            rects += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2" ry="2" fill="${color}" />\n`;
        }
    }
    
    
    
    // Snake path crawling along grid lines (closed loop within grid bounds)
    const snakePath = `M 6.5 6.5 L 682.5 6.5 L 682.5 84.5 L 357.5 84.5 L 357.5 45.5 L 201.5 45.5 L 201.5 84.5 L 6.5 84.5 Z`;
    
    return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 710 110" width="100%" height="110">
  <style>
    .bg { fill: #0d1117; }
    .snake-track {
      stroke: #161b22;
      stroke-width: 1px;
      fill: none;
    }
  </style>
  <defs>
    <filter id="snake-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="100%" height="100%" class="bg" rx="6" />
  <g transform="translate(10, 10)">
    ${rects}
    <path d="${snakePath}" class="snake-track" />
    
    <!-- Glowing snake body segments (tapering sizes for organic snake look) -->
    <g filter="url(#snake-glow)">
      <!-- Tail 2 -->
      <circle r="2.0" fill="#ff3366" opacity="0.3">
        <animateMotion path="${snakePath}" dur="3.5s" repeatCount="indefinite" begin="-0.132s" />
      </circle>
      <!-- Tail 1 -->
      <circle r="2.8" fill="#ff3366" opacity="0.5">
        <animateMotion path="${snakePath}" dur="3.5s" repeatCount="indefinite" begin="-0.110s" />
      </circle>
      <!-- Body 4 -->
      <circle r="3.6" fill="#ff3366" opacity="0.65">
        <animateMotion path="${snakePath}" dur="3.5s" repeatCount="indefinite" begin="-0.088s" />
      </circle>
      <!-- Body 3 -->
      <circle r="4.4" fill="#ff3366" opacity="0.8">
        <animateMotion path="${snakePath}" dur="3.5s" repeatCount="indefinite" begin="-0.066s" />
      </circle>
      <!-- Body 2 -->
      <circle r="5.0" fill="#ff3366" opacity="0.9">
        <animateMotion path="${snakePath}" dur="3.5s" repeatCount="indefinite" begin="-0.044s" />
      </circle>
      <!-- Body 1 -->
      <circle r="5.5" fill="#ff3366" opacity="0.95">
        <animateMotion path="${snakePath}" dur="3.5s" repeatCount="indefinite" begin="-0.022s" />
      </circle>
      <!-- Head -->
      <circle r="6.0" fill="#ff1a40" opacity="1.0">
        <animateMotion path="${snakePath}" dur="3.5s" repeatCount="indefinite" begin="0s" />
      </circle>
    </g>
  </g>
</svg>`;
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Profile README Live Preview</title>
    <!-- GitHub Markdown CSS Dark Theme -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.min.css">
    <style>
        body {
            background-color: #0d1117;
            color: #c9d1d9;
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
        }
        .container {
            max-width: 888px;
            width: 100%;
            background-color: #0d1117;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 32px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .flame-banner {
            position: relative;
            width: 100%;
            height: 220px;
            background-color: #0b0f19;
            border-radius: 6px;
            overflow: hidden;
            border-bottom: 2px solid #00f2fe;
            box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
            margin-bottom: 24px;
        }
        .flame-svg {
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        .flame-wave {
            transform-origin: bottom center;
        }
        .wave-1 {
            animation: flicker1 3s ease-in-out infinite alternate;
        }
        .wave-2 {
            animation: flicker2 2.2s ease-in-out infinite alternate;
        }
        .wave-3 {
            animation: flicker3 1.8s ease-in-out infinite alternate;
        }

        @keyframes flicker1 {
            0% { transform: scaleY(1) skewX(-2deg); }
            100% { transform: scaleY(1.15) skewX(2deg); }
        }
        @keyframes flicker2 {
            0% { transform: scaleY(1.2) skewX(3deg); }
            100% { transform: scaleY(0.9) skewX(-3deg); }
        }
        @keyframes flicker3 {
            0% { transform: scaleY(0.85) skewX(-1deg); }
            100% { transform: scaleY(1.1) skewX(1deg); }
        }
        .banner-overlay {
            position: absolute;
            top: 15px;
            right: 20px;
            z-index: 3;
        }
        .banner-content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
        }
        .banner-content h1 {
            color: #ffffff;
            font-size: 26px;
            margin: 0 0 5px 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.6);
        }
        .banner-typing {
            height: 35px;
            margin-bottom: 5px;
        }
        .banner-typing img {
            max-width: 100%;
            height: auto;
        }
        .banner-badges {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 10px;
        }
        .banner-badges img {
            height: 28px;
            border-radius: 4px;
        }
        .markdown-body h1:first-of-type {
            display: none !important;
        }
        .markdown-body p:first-of-type {
            display: none !important;
        }
        .markdown-body p:nth-of-type(2) {
            display: none !important;
        }
        .badge {
            background-color: #238636;
            color: #ffffff;
            font-size: 12px;
            font-weight: 600;
            padding: 3px 12px;
            border-radius: 2em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="flame-banner">
            <svg viewBox="0 0 800 120" preserveAspectRatio="none" class="flame-svg">
                <defs>
                    <linearGradient id="flame1" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stop-color="#0b0f19" stop-opacity="0" />
                        <stop offset="50%" stop-color="#0072ff" stop-opacity="0.3" />
                        <stop offset="100%" stop-color="#00f2fe" stop-opacity="0.8" />
                    </linearGradient>
                    <linearGradient id="flame2" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stop-color="#0b0f19" stop-opacity="0" />
                        <stop offset="40%" stop-color="#0052d4" stop-opacity="0.4" />
                        <stop offset="100%" stop-color="#00d2ff" stop-opacity="0.8" />
                    </linearGradient>
                    <linearGradient id="flame3" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stop-color="#0b0f19" stop-opacity="0" />
                        <stop offset="30%" stop-color="#4364f7" stop-opacity="0.3" />
                        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.8" />
                    </linearGradient>
                    <filter id="flame-blur">
                        <feGaussianBlur stdDeviation="3" />
                    </filter>
                </defs>
                <path d="M 0 120 Q 100 20 200 120 T 400 120 T 600 120 T 800 120 L 800 120 L 0 120 Z" fill="url(#flame1)" class="flame-wave wave-1" />
                <path d="M 0 120 Q 150 40 300 120 T 600 120 T 800 120 L 800 120 L 0 120 Z" fill="url(#flame2)" class="flame-wave wave-2" filter="url(#flame-blur)" />
                <path d="M 0 120 Q 80 50 160 120 T 320 120 T 480 120 T 640 120 T 800 120 L 800 120 L 0 120 Z" fill="url(#flame3)" class="flame-wave wave-3" />
            </svg>
            <div class="banner-overlay">
                <span class="badge">Live</span>
            </div>
            <div class="banner-content">
                <h1>👋 Hey there! I'm Aditya Sharma</h1>
                <div class="banner-typing">
                    <img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=600&size=24&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=850&lines=AI+%26+Machine+Learning+Enthusiast+%F0%9F%A4%96;Data+Science+Explorer+%F0%9F%93%8A;Python+%26+Full+Stack+Developer+%F0%9F%90%8D;Building+Real-World+AI+Solutions+%F0%9F%9A%80" alt="Typing SVG" />
                </div>
                <div class="banner-badges">
                    <a href="https://github.com/Adiipandit255" target="_blank">
                        <img src="https://komarev.com/ghpvc/?username=Adiipandit255&label=Profile+Views&style=for-the-badge&color=0284c7" alt="Profile Views" />
                    </a>
                    <a href="https://github.com/Adiipandit255?tab=followers" target="_blank">
                        <img src="https://img.shields.io/github/followers/Adiipandit255?style=for-the-badge&logo=github&color=0f172a" alt="Followers" />
                    </a>
                    <a href="https://github.com/Adiipandit255?tab=stars" target="_blank">
                        <img src="https://img.shields.io/github/stars/Adiipandit255?style=for-the-badge&color=0f172a" alt="Stars" />
                    </a>
                </div>
            </div>
        </div>
        <article class="markdown-body" id="content">
            Loading preview...
        </article>
    </div>

    <!-- Marked JS Parser -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
        marked.use({
            gfm: true,
            breaks: true
        });

        const contentEl = document.getElementById('content');
        let lastMarkdown = '';

        function fetchMarkdown() {
            fetch('/raw-readme')
                .then(res => {
                    if (!res.ok) throw new Error('Status ' + res.status);
                    return res.text();
                })
                .then(markdown => {
                    // Intercept and replace snake URLs with local preview generator
                    let processed = markdown.replace(
                        /https:\\/\\/raw\\.githubusercontent\\.com\\/Adiipandit255\\/Adiipandit255\\/output\\/github-contribution-grid-snake(-dark)?\\.svg/g,
                        '/local-snake.svg'
                    );


                    if (processed !== lastMarkdown) {
                        lastMarkdown = processed;
                        contentEl.innerHTML = marked.parse(processed);
                    }
                })
                .catch(err => {
                    contentEl.innerHTML = '<span style="color: #f85149">Error loading README content: ' + err.message + '</span>';
                });
        }

        // Poll every 1 second
        fetchMarkdown();
        setInterval(fetchMarkdown, 1000);
    </script>
</body>
</html>
        `);
    } else if (req.url === '/raw-readme') {
        fs.readFile(README_PATH, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Error reading README: ' + err.message);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(data);
        });
    } else if (req.url === '/local-snake.svg') {
        res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8' });
        res.end(generateSnakeSVG());

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Live preview server started at: http://localhost:${PORT}/`);
    console.log(`📝 Monitoring: ${README_PATH}\n`);
});
