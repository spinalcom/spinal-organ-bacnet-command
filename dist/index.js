"use strict";
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
const utils_1 = require("./utils");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const config = require("../config.js");
const { protocol, host, port, userId, password, command_context_name, digitaltwin_path } = config.spinalConnector;
const url = `${protocol}://${userId}:${password}@${host}:${port}/`;
const connect = spinal_core_connectorjs_type_1.spinalCore.connect(url);
(0, utils_1.getGraph)(connect, digitaltwin_path).then((graph) => __awaiter(void 0, void 0, void 0, function* () {
    const context = yield graph.getContext(command_context_name);
    console.log("getting bmsEndpoints...");
    const bmsEndpoints = yield (0, utils_1.getAllBmsEndpoint)(context);
    console.log(bmsEndpoints.length, "endpoint(s) found");
    (0, utils_1.bindEndpoints)(bmsEndpoints);
}));
//# sourceMappingURL=index.js.map