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
    </style>
</head>
<body>
    <div class="container">
        <article class="markdown-body" id="content">
            Loading preview...
        </article>
    </div>

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
                        /https:\/\/raw\.githubusercontent\.com\/Adiipandit255\/Adiipandit255\/output\/github-contribution-grid-snake(-dark)?\.svg/g,
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
    } else if (req.url === '/banner.svg') {
        const bannerPath = path.join(__dirname, 'banner.svg');
        fs.readFile(bannerPath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8' });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Live preview server started at: http://localhost:${PORT}/`);
    console.log(`📝 Monitoring: ${README_PATH}\n`);
});
