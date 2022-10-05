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
exports.spinalPilot = void 0;
const BacnetGlobalVariables_1 = require("./BacnetGlobalVariables");
const bacnet = require("bacstack");
class SpinalPilot {
    constructor() { }
    sendPilotRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.writeProperty(request);
                // console.log("success");
            }
            catch (error) {
                console.error(error.message);
                return false;
            }
        });
    }
    // public async writeProperties(request: IRequest) {
    //    // if (!Array.isArray(requests)) requests = [requests];
    //    // for (let index = 0; index < requests.length; index++) {
    //    // const req = requests[index];
    //    return this.writeProperty(request);
    //    // }
    // }
    writeProperty(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const types = this.getDataTypes(req.objectId.type);
            let success = false;
            while (types.length > 0 && !success) {
                const type = types.shift();
                try {
                    yield this.useDataType(req, type);
                    success = true;
                }
                catch (error) {
                    // throw error;
                }
            }
            return success;
        });
    }
    useDataType(req, dataType) {
        return new Promise((resolve, reject) => {
            const client = new bacnet();
            const value = dataType === BacnetGlobalVariables_1.APPLICATION_TAGS.BACNET_APPLICATION_TAG_ENUMERATED ? (req.value ? 1 : 0) : req.value;
            client.writeProperty(req.address, req.objectId, BacnetGlobalVariables_1.PropertyIds.PROP_PRESENT_VALUE, [{ type: dataType, value: value }], { priority: 16 }, (err, value) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(value);
            });
        });
    }
    getDataTypes(type) {
        switch (type) {
            case BacnetGlobalVariables_1.ObjectTypes.OBJECT_ANALOG_INPUT:
            case BacnetGlobalVariables_1.ObjectTypes.OBJECT_ANALOG_OUTPUT:
            case BacnetGlobalVariables_1.ObjectTypes.OBJECT_ANALOG_VALUE:
            case BacnetGlobalVariables_1.ObjectTypes.OBJECT_MULTI_STATE_INPUT:
            case BacnetGlobalVariables_1.ObjectTypes.OBJECT_MULTI_STATE_OUTPUT:
            case BacnetGlobalVariables_1.ObjectTypes.OBJECT_MULTI_STATE_VALUE:
                return [
                    BacnetGlobalVariables_1.APPLICATION_TAGS.BACNET_APPLICATION_TAG_SIGNED_INT,
                    BacnetGlobalVariables_1.APPLICATION_TAGS.BACNET_APPLICATION_TAG_UNSIGNED_INT,
                    BacnetGlobalVariables_1.APPLICATION_TAGS.BACNET_APPLICATION_TAG_REAL,
                    BacnetGlobalVariables_1.APPLICATION_TAGS.BACNET_APPLICATION_TAG_DOUBLE
                ];
            case BacnetGlobalVariables_1.ObjectTypes.OBJECT_BINARY_INPUT:
            case BacnetGlobalVariables_1.ObjectTypes.OBJECT_BINARY_OUTPUT:
            case BacnetGlobalVariables_1.ObjectTypes.OBJECT_BINARY_VALUE:
            case BacnetGlobalVariables_1.ObjectTypes.OBJECT_BINARY_LIGHTING_OUTPUT:
                return [
                    BacnetGlobalVariables_1.APPLICATION_TAGS.BACNET_APPLICATION_TAG_ENUMERATED,
                    BacnetGlobalVariables_1.APPLICATION_TAGS.BACNET_APPLICATION_TAG_BOOLEAN
                ];
            default:
                return [
                    BacnetGlobalVariables_1.APPLICATION_TAGS.BACNET_APPLICATION_TAG_OCTET_STRING,
                    BacnetGlobalVariables_1.APPLICATION_TAGS.BACNET_APPLICATION_TAG_CHARACTER_STRING,
                    BacnetGlobalVariables_1.APPLICATION_TAGS.BACNET_APPLICATION_TAG_BIT_STRING
                ];
        }
    }
}
const spinalPilot = new SpinalPilot();
exports.spinalPilot = spinalPilot;
exports.default = spinalPilot;
//# sourceMappingURL=spinalPilot.js.map