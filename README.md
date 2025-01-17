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
nohup npm run start &
```

## Management on Remote Server

To check if the service is running, you can use the following command:

```bash
ps aux | grep npm
```

The output should look like this:

```bash
bike4sa+    5898  0.0  1.7 1109916 61944 pts/0   Sl   09:51   0:00 npm run start
bike4sa+    5958  0.0  0.0   7152  2180 pts/0    S+   09:56   0:00 grep --color=auto npm
```

If the service is not running, the output will be something like this:

```bash
bike4sa+    5958  0.0  0.0   7152  2180 pts/0    S+   09:56   0:00 grep --color=auto npm
```

If multiple instances of the service are running, the output will be something like this:

```bash
bike4sa+    5898  0.0  1.7 1109916 61944 pts/0   Sl   09:51   0:00 npm run start
bike4sa+    5899  0.0  1.7 1109916 61944 pts/0   Sl   09:51   0:00 npm run start
bike4sa+    5958  0.0  0.0   7152  2180 pts/0    S+   09:56   0:00 grep --color=auto npm
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
tail -n 100 nohup.out
```

This will show the last 100 lines of the `nohup.out` file. To see different lines, you can change the number.
