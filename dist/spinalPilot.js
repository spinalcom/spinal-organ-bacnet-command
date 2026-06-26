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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinalPilot = void 0;
// import * as bacnet from "bacstack";
const pQueue = require("@esm2cjs/p-queue").default;
const { AbortError } = require("@esm2cjs/p-queue");
const BacnetUtils_js_1 = __importDefault(require("./BacnetUtils.js"));
class SpinalPilot {
    constructor() {
        this.client = null;
        this.queue = new pQueue({ concurrency: 1 });
        // this.client = new bacnet({ adpuTimeout: 10000 });
    }
    sendPilotRequest(request, endpointElement) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const endpointName = endpointElement.name.get();
                const releasePriority = false; // Set to true if you want to release the priority after the request is sent
                if (!request.priority)
                    request.priority = this._getBacnetPriority();
                const data = yield BacnetUtils_js_1.default.sendPilotRequest(request, releasePriority);
                console.log(request.value != null ? endpointName + ` a changé de value => ${request.value}` : "Priorité relachée pour le : " + endpointName);
                return data;
            }
            catch (error) {
                console.error(error.message);
                return false;
            }
        });
    }
    _getBacnetPriority() {
        const bacnet_priority = process.env.BACNET_PRIORITY || "16";
        return parseInt(bacnet_priority);
    }
}
const spinalPilot = new SpinalPilot();
exports.spinalPilot = spinalPilot;
exports.default = spinalPilot;
//# sourceMappingURL=spinalPilot.js.map