"use strict";
/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const utils_1 = require("./utils");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const userId = process.env.USER_ID;
const password = process.env.PASSWORD;
const protocol = process.env.PROTOCOL;
const host = process.env.HOST;
const port = process.env.PORT;
const command_context_name = process.env.COMMAND_CONTEXT_NAME;
const digitaltwin_path = process.env.DIGITAL_TWIN_PATH;
const url = `${protocol}://${userId}:${password}@${host}:${port}/`;
const connect = spinal_core_connectorjs_type_1.spinalCore.connect(url);
// Cette fonction est executée en cas de deconnexion au hub
spinal_core_connectorjs_type_1.FileSystem.onConnectionError = (error_code) => {
    console.log("redemarrage");
    process.exit(error_code); // kill le process;
};
(0, utils_1.getGraph)(connect, digitaltwin_path).then((graph) => __awaiter(void 0, void 0, void 0, function* () {
    const context = yield graph.getContext(command_context_name);
    console.log("getting bmsEndpoints...");
    const bmsEndpoints = yield (0, utils_1.getAllBmsEndpoint)(context);
    console.log(bmsEndpoints.length, "endpoint(s) found");
    console.log("binding...");
    yield (0, utils_1.bindEndpoints)(bmsEndpoints);
    console.log("** Done **");
}));
//# sourceMappingURL=index.js.map