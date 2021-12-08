module.exports = {
  apps: [
    {
      name: 'Janken API',
      script: './graphql/index.js',
      env: {
        PORT: 4000,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 4001,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'Watch NFT Owner',
      script: './cmd/watch.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
