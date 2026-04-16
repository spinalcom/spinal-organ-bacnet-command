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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const utils_js_1 = require("./utils.js");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_bacnet_service_1 = require("spinal-bacnet-service");
const BacnetUtils_js_1 = __importDefault(require("./BacnetUtils.js"));
const userId = process.env.USER_ID;
const password = process.env.PASSWORD;
const protocol = process.env.PROTOCOL;
const host = process.env.HOST;
const port = process.env.PORT;
const command_context_name = process.env.COMMAND_CONTEXT_NAME;
const command_category_name = process.env.COMMAND_CATEGORY_NAME;
const command_group_name = process.env.COMMAND_GROUP_NAME;
const digitaltwin_path = process.env.DIGITAL_TWIN_PATH;
const organ_name = process.env.ORGAN_NAME;
const url = `${protocol}://${userId}:${password}@${host}:${port}/`;
const connect = spinal_core_connectorjs_type_1.spinalCore.connect(url);
let config = {
    name: organ_name,
    host: host,
    protocol: protocol,
    port: port
};
// Cette fonction est executée en cas de deconnexion au hub
spinal_core_connectorjs_type_1.FileSystem.onConnectionError = (error_code) => {
    console.log("redemarrage");
    process.exit(error_code); // kill le process;
};
(0, utils_js_1.getGraph)(connect, digitaltwin_path, config).then((graph) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, spinal_bacnet_service_1.launchBacnetService)(); // On lance le service bacnet avant toute chose pour être sûr qu'il soit opérationnel avant de tenter de s'y connecter
    yield BacnetUtils_js_1.default.initAndConnect(); // On initialise la connexion au service bacnet, et on met en place un listener pour se reconnecter automatiquement en cas de deconnexion du service bacnet
    const context = yield graph.getContext(command_context_name);
    if (!context)
        throw new Error(`No context found for "${command_context_name}"`);
    const startNode = yield (0, utils_js_1.getStartNode)(context, command_category_name, command_group_name);
    console.log("getting bmsEndpoints...");
    const bmsEndpoints = yield (0, utils_js_1.getAllBmsEndpoint)(startNode, context);
    console.log(bmsEndpoints.length, "endpoint(s) found");
    console.log("binding...");
    yield (0, utils_js_1.bindEndpoints)(bmsEndpoints);
    console.log("** Done **");
})).catch(err => {
    console.error(err.message || err);
    process.exit(0);
});
//# sourceMappingURL=index.js.map