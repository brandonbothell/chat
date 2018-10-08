// Simple wrapper exposing environment variables to rest of the code.

const jetpack = require('fs-jetpack')

// The variables have been written to `env.json` by the build process.
const env: { name: string, description: string } = jetpack.cwd(__dirname).read('env.json', 'json')

export default env
