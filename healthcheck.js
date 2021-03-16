const Docker = require('dockerode')

const docker = new Docker()

docker.ping()
  .then(() => {
    console.log('Socket is accessible.')
    process.exitCode = 0
  })
  .catch(err => {
    console.error(err)
    process.exitCode = 1
  })
