module.exports = [
  {
    glob: '/index.html',
    push: [
      '/**/*',
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
  }
]
