const fs = require('fs').promises
const Promise = require('bluebird')
const Docker = require('dockerode')
const cron = require('cron')

const docker = new Docker({ Promise })

function exec (opts) {
  return async () => {
    const filters = JSON.stringify(opts.filters)
    const containers = await docker.listContainers({ filters })

    if (containers.length === 0) {
      return console.warn('No containers found: %s', filters)
    }

    const container = docker.getContainer(containers[0].Id)
    const exec = await container.exec(opts.exec)

    await exec.start()
    console.log('Exec started in container: %s. Cmd: %s', containers[0].Id, opts.exec.Cmd)
  }
}

async function createJob (opts) {
  if (typeof opts !== 'object') {
    throw new TypeError('Job config must be an object.')
  }

  if (typeof opts.filters === 'undefined') {
    throw new Error('Job must specify container filters.')
  }

  if (typeof opts.schedule === 'undefined') {
    throw new Error('Job must specify a cron pattern schedule.')
  }

  if (typeof opts.exec === 'undefined') {
    throw new Error('Job must specify execution options.')
  }

  const job = new cron.CronJob(opts.schedule, exec(opts))
  job.start()
}

async function run () {
  const config = await fs.readFile('/opt/container-cron/config.json')
  const jobs = JSON.parse(config)

  if (!Array.isArray(jobs)) {
    throw new TypeError('Config must be an array of cron job objects.')
  }

  if (jobs.length === 0) {
    console.warn('No jobs specified.')
  }

  Promise.each(jobs, createJob)
}

run().catch(err => {
  console.error(err)
  process.exitCode = 1
})
