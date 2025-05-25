# Cipher Quant

## Requirements

- node 18+

## Setup

```bash
npm install
```

It requires a `.env` file with the following variable:

- `DISCORD_TOKEN`

## Run

```bash
npm run start
```

NOTE: When running on a remote server, you can run the service in the background using the following command:

```bash
nohup ./run.sh > out.log 2> err.log &
```

## Management on Remote Server

To check if the service is running, you can use the following command:

```bash
ps aux | grep run.sh
```

The output should look like this:

```bash
bike4sa+   11805  0.0  0.1   7832  3584 pts/0    S    18:46   0:00 /bin/bash ./run.sh
bike4sa+   11850  0.0  0.0   7156  2276 pts/0    S+   18:47   0:00 grep --color=auto run.sh
```

If the service is not running, the output will be something like this:

```bash
bike4sa+   11850  0.0  0.0   7156  2276 pts/0    S+   18:47   0:00 grep --color=auto run.sh
```

If multiple instances of the service are running, the output will be something like this:

```bash
bike4sa+   11805  0.0  0.1   7832  3584 pts/0    S    18:46   0:00 /bin/bash ./run.sh
bike4sa+   11805  0.0  0.1   7832  3584 pts/0    S    18:46   0:00 /bin/bash ./run.sh
bike4sa+   11850  0.0  0.0   7156  2276 pts/0    S+   18:47   0:00 grep --color=auto run.sh
```

NOTE: We want to run only one instance of the service.

To stop an instance, you can use the following command:

```bash
kill -9 <pid>
```

Where `<pid>` is the PID of the instance you want to stop. It can be found in the output of above command.
For example, above it is 5898

Following command is helpful when reading logs:

```bash
tail -n 100 out.log
```

This will show the last 100 lines of the `nohup.out` file. To see different lines, you can change the number.

```bash
tail -f out.log
```

To view live logs, you can use the above command.

## Management using PM2

You can use PM2 to manage the service.
To see if cipher-quant is running, you can use the following command:

```bash
pm2 list
```

The output should look like this:
```bash
│ id │ name               │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ cipher-quant-v2    │ default     │ 1.0.0   │ fork    │ 2344506  │ 0s     │ 0    │ online    │ 0%       │ 31.5mb   │ bik… │ disabled │
```

To stop the service, you can use the following command:

```bash
pm2 stop cipher-quant-v2
```

To restart the service, you can use the following command:

```bash
pm2 restart cipher-quant-v2
```

To view logs, you can use the following command:

```bash
pm2 logs cipher-quant-v2
```
