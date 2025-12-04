import path from 'path';
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'nest',
      appPath: './src/main.ts',
      exportName: 'viteNodeApp',
      tsCompiler: 'esbuild',
      swcOptions: {},
    }),
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    target: 'node22',
    rollupOptions: {
      input: './src/main.ts',
      output: {
        entryFileNames: 'main.js',
      },
    },
  },
  optimizeDeps: {
    exclude: [
      '@nestjs/microservices',
      '@nestjs/websockets',
      'cache-manager',
      'class-transformer',
      'class-validator',
      '@nestjs/swagger',
    ],
  },
});
