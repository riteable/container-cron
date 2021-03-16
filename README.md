# Container Cron

A cron job scheduler for Docker containers compatible with Swarm mode.

## Why

While in Docker Swarm mode, you will probably have multiple instances of a container running. So, if you need to schedule a cron task inside a container, you will have duplicate tasks running. Now you can run a cron task inside a single container.

## Config

An exmple config will look like the following:

```json
[
  {
    "filters": {
      "label": ["com.example.app"]
    },
    "schedule": "0 */15 * * * *",
    "exec": {
      "Cmd": ["/bin/sh", "-c", "/app/some-task.sh"],
      "User": "1000:1000"
    }
  }
]
```

The config is an array containing objects with options. The options are:

- `"filters"`: This is used to select the container which needs to run the cron task. See [Docker Engine API](https://docs.docker.com/engine/api/v1.41/#operation/ContainerList) for possible `filters` options. When multiple containers are returned, the first one is selected to run the cron task.

- `"schedule"`: The cron pattern which determines the schedule. The pattern accepts 6 fields, with the first field indicating a granularity in seconds.

- `"exec"`: Options for the execution command. See [Docker Engine API](https://docs.docker.com/engine/api/v1.41/#operation/ContainerExec) for available options.
