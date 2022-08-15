module.exports = {
    presets: ['@babel/preset-env'],
    env: {
        test: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-modules-commonjs'],
        },
    },
};
