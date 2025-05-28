import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    output: [
        {
            dir: 'dist/esm',
            format: 'esm',
            preserveModules: true,
            preserveModulesRoot: 'src'
        },
        {
            dir: 'dist/cjs',
            format: 'cjs',
            preserveModules: true,
            preserveModulesRoot: 'src'
        }
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json'
        }),
        nodeResolve({
            moduleDirectories: ['node_modules']
        })
    ],
    external: (id) => {
        return id.includes('node_modules') && !id.includes('tslib');
    }
};