import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import {renderApplication} from '@angular/platform-server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  // perf guardrails - slow routes
  server.get('*', async (req, res) => {
    const start = performance.now();

    try {
      const html = await renderApplication(bootstrap, {
        url: req.originalUrl,
        document: indexHtml,
        platformProviders: [
          { provide: APP_BASE_HREF, useValue: req.baseUrl }
        ],
      });

      const duration = performance.now() - start;
      const status = duration > 1500 ? '⚠️ slow' : '✅ ok';
      console.log(`[SSR] ${status} ${req.originalUrl} (${Math.round(duration)}ms)`);

      res.status(200).send(html);
    } catch (err) {
      console.error('[SSR] render failed', err);
      res.status(500).send('<h1>500 — Server Error</h1>');
    }
  });

  // perf guardrails - monitoring alerts
  server.get('/healthz', (req, res) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      memory: process.memoryUsage().rss,
      timestamp: new Date().toISOString(),
    });
  });


  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
