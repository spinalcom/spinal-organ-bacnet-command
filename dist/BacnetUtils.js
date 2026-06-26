"use strict";
/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacnetUtilities = void 0;
const uuid_1 = require("uuid");
const node_ipc_1 = __importDefault(require("node-ipc"));
const spinal_bacnet_service_1 = require("spinal-bacnet-service");
const bacnet_priority = process.env.BACNET_PRIORITY || "16";
class BacnetUtilitiesClass {
    constructor() {
        this._ipcClient = null;
        this._clientId = process.env.ORGAN_NAME || "spinal-organ-bacnet";
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new BacnetUtilitiesClass();
        return this.instance;
    }
    initAndConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this._ipcClient = yield this._connectToServer();
            this._ipcClient.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
                this._ipcClient = yield this._connectToServer();
            }));
            console.log("connected to bacnet service");
        });
    }
    _connectToServer() {
        return new Promise((resolve, reject) => {
            var _a;
            const serverServiceName = spinal_bacnet_service_1.SERVICE_NAME;
            const clientServiceName = this._clientId;
            node_ipc_1.default.config.id = clientServiceName; // Set the IPC client ID to the organ name or a default value
            node_ipc_1.default.config.retry = 5000; // Retry every 5 seconds if connection to server is lost
            node_ipc_1.default.config.silent = true; // Disable IPC debug logs
            const bacnetServicePort = (_a = process.env.BACNET_SERVICE_PORT) === null || _a === void 0 ? void 0 : _a.trim();
            const ipcServerPort = bacnetServicePort ? parseInt(bacnetServicePort) : 47810;
            node_ipc_1.default.connectToNet(serverServiceName, "127.0.0.1", ipcServerPort, () => {
                this._ipcClient = node_ipc_1.default.of[serverServiceName];
                resolve(node_ipc_1.default.of[serverServiceName]);
            });
        });
    }
    sendPilotRequest(request, releasePriority = false) {
        request.priority = bacnet_priority;
        return this._sendDataToBacnetServer("writeProperty", [request, releasePriority]);
    }
    _sendDataToBacnetServer(functionName, parameters) {
        return new Promise((resolve, reject) => {
            const params = {
                name: functionName,
                id: (0, uuid_1.v4)(),
                parameters: parameters,
                _clientId: this._clientId,
                timestamp: Date.now(),
            };
            this._ipcClient.emit(spinal_bacnet_service_1.MESSAGE_EVENT_NAME, params);
            this._ipcClient.once(`${spinal_bacnet_service_1.RESPONSE_EVENT_NAME}_${params.id}`, (response) => {
                if (response.status === "error") {
                    return reject({ message: response.error });
                }
                resolve(response.data);
            });
        });
    }
}
const BacnetUtilities = BacnetUtilitiesClass.getInstance();
exports.BacnetUtilities = BacnetUtilities;
exports.default = BacnetUtilities;
//# sourceMappingURL=BacnetUtils.js.map