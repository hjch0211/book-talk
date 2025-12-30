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
      exportName: 'booktalkApplication',
      tsCompiler: 'esbuild',
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
  ssr: {
    noExternal: [
      '@langchain/core',
      '@langchain/langgraph',
      '@langchain/openai',
      'langfuse',
      'langfuse-langchain',
    ],
  },
});
