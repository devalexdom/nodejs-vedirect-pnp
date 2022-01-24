import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'

export default [
    // ES Modules
    {
        input: 'src/index.ts',
        output: [{
            file: 'dist/index.js', format: 'cjs',
        }
        ],
        plugins: [
            typescript({ useTsconfigDeclarationDir: true }),
            babel({ extensions: ['.ts'] }),
        ],
    },

]
