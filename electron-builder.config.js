module.exports = {
  appId: 'com.archdraw.app',
  productName: 'Archdraw',
  directories: {
    output: 'dist/packages',
  },
  files: [
    'dist/electron/**/*',
    'dist/renderer/**/*',
    'package.json',
  ],
  win: {
    target: [
      { target: 'nsis', arch: ['x64'] },
      { target: 'portable', arch: ['x64'] },
    ],
    icon: 'assets/icon.ico',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    installerLanguages: ['nb-NO', 'en-US'],
    language: 'nb-NO',
  },
  publish: {
    provider: 'github',
    owner: 'jonathanaas82-dotcom',
    repo: 'archdraw',
  },
}
