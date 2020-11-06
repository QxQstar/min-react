module.exports = {
    entry: {
        part1: './src/part1/eg.tsx',
        part2: './src/part2/eg.tsx'
    },
    mode: 'development',
    optimization: {
        minimize: false
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'ts-loader'
                }
            ]
        }]
    },
    resolve:{
        extensions:['.ts','.tsx','.js']
    }
}