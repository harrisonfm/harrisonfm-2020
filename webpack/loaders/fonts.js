module.exports = {
  test: /\.(woff(2)?|ttf|eot)$/,
    type: 'asset/resource',
    generator: {
        filename: './fonts/[name][ext]',
    },
};
