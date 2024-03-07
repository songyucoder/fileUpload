import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  css:{
	//* css模块化
	 modules: { // css模块化 文件以.module.[css|less|scss]结尾
		 generateScopedName: '[name]__[local]___[hash:base64:5]',
		 hashPrefix: 'prefix',
	},
	//* 预编译支持less
	 preprocessorOptions: {
		  less: {
			// 支持内联 JavaScript
			javascriptEnabled: true,
		  },
	},
},
  build: {
	    cssCodeSplit: true,
		outDir: "file-operate-ui", //输出文件名称
		lib: {
			entry: path.resolve(__dirname, "./src/components/index.js"), //指定组件编译入口文件
			name: "file-operate-ui",
			fileName: "file-operate-ui",
		}, //库编译模式配置
		rollupOptions: {
			// 确保外部化处理那些你不想打包进库的依赖
			external: ["vue"],
			output: {
				// 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
				globals: {
					vue: "Vue",
				},
			},
		}, // rollup打包配置
	},
	plugins: [
		vue({
		  css: true, // 默认启用，它会处理CSS并将其包含在构建输出中
		}),
	  ],
})
