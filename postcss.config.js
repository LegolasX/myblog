module.exports = {
    plugins: {
        // fix @import
        'postcss-import': {},
        // cssnext contains autoprefixer
        // browser option
        'postcss-cssnext': {
            'browsers': [
                'iOS >= 8',
                'Chrome >= 45',
                'Android >= 4',
                'IE > 10'
            ]
        }
    }
}
