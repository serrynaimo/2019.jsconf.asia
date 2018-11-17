module.exports = [
  {
    glob: '/index.html',
    push: [
      '/**/*',
      '!/lightning/**/*',
      '!/terms/**/*',
      '!/lunch/**/*'
    ]
  },
  {
    glob: '/lunch/index.html',
    push: [
      '/favicon.png'
    ]
  },
  {
    glob: '/terms/index.html',
    push: [
      '/favicon.png'
    ]
  },
  {
    glob: '/lightning/index.html',
    push: [
      '/favicon.png'
    ]
  },
]
