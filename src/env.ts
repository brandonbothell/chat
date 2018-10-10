import * as jetpack from 'fs-jetpack'

const env: { name: string, description: string } = jetpack.cwd(__dirname).read('env.json', 'json')

export default env
