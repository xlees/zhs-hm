import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';


export default defineConfig({
	plugins: [uni()],
	
	css: {
		preprocessorOptions: {
			scss: {
				// additionalData: `@import "@/uni_modules/uview-plus/libs/css/mixin.scss";`,
			}
		}
	}
	
	// resolve: {
	//   alias: {
	//     '@': '/'
	//   }
	// },
});
