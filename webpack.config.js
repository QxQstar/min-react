module.exports = {
    entry: {
        index: './src/example.tsx',
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