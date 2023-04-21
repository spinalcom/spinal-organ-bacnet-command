require("json5/lib/register");
const pm2 = require("pm2");

module.exports = {
  apps: [
    {
      name: "spinal-organ-bacnet-command",
      script: "./dist/index.js",
      cwd: "./",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      max_memory_restart: "3G",
      node_args: "--max-old-space-size=4096",
    },
  ],
};
