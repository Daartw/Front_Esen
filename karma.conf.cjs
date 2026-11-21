/**
 * Pruebas unitarias del frontend con Jasmine (framework de pruebas) y Karma (ejecutor en navegador).
 * Karma abre Chrome sin interfaz, empaqueta los archivos *.spec.js(x) con webpack + Babel
 * y mide la cobertura con Istanbul. El informe queda en coverage/html/index.html.
 */
module.exports = function configurar(config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    files: [{ pattern: 'src/**/*.spec.@(js|jsx)', watched: false }],
    preprocessors: { 'src/**/*.spec.@(js|jsx)': ['webpack'] },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          // package.json usa "type": "module"; esto permite importar sin escribir la extension.
          { test: /\.m?jsx?$/, resolve: { fullySpecified: false } },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '100' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                // Instrumenta el codigo de la app (no las pruebas) para medir cobertura.
                plugins: [['istanbul', { exclude: ['**/*.spec.js', '**/*.spec.jsx', 'src/test/**'] }]],
              },
            },
          },
          { test: /\.css$/, type: 'asset/source' },
        ],
      },
    },

    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' },
        { type: 'json-summary', subdir: '.' },
        { type: 'text-summary' },
      ],
    },
    client: { clearContext: false, jasmine: { random: false } },

    browsers: ['ChromeHeadlessSinSandbox'],
    customLaunchers: {
      ChromeHeadlessSinSandbox: { base: 'ChromeHeadless', flags: ['--no-sandbox'] },
    },
    singleRun: false,
    restartOnFileChange: true,
  });
};
