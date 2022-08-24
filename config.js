require("dotenv").config();

module.exports = {
  spinalConnector: {
    userId: process.env.USER_ID || "EDIT_ME",
    password: process.env.PASSWORD || "EDIT_ME",
    protocol: process.env.PROTOCOL || "EDIT_ME",
    host: process.env.HOST || "EDIT_ME",
    port: process.env.PORT || "EDIT_ME",
    command_context_name: process.env.COMMAND_CONTEXT_NAME || "EDIT_ME",
    digitaltwin_path: process.env.DIGITAL_TWIN_PATH || "EDIT_ME"
  },
};
