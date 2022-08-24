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
exports.bindEndpoints = exports.getAllBmsEndpoint = exports.getGraph = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const spinalPilot_1 = require("./spinalPilot");
const endpointToDeviceMap = new Map();
function getGraph(connect, digitaltwin_path) {
    return new Promise((resolve, reject) => {
        spinal_core_connectorjs_type_1.spinalCore.load(connect, digitaltwin_path, (graph) => __awaiter(this, void 0, void 0, function* () {
            resolve(graph);
        }), () => reject("digital twin not found"));
    });
}
exports.getGraph = getGraph;
function getAllBmsEndpoint(context) {
    return context.findInContextAsyncPredicate(context, (node) => __awaiter(this, void 0, void 0, function* () {
        if (node.getType().get() === spinal_model_bmsnetwork_1.SpinalBmsEndpoint.nodeTypeName) {
            yield getEndpointDevice(node);
            return true;
        }
        return false;
    }));
}
exports.getAllBmsEndpoint = getAllBmsEndpoint;
function bindEndpoints(endpoints) {
    const promises = endpoints.map((endpointNode) => __awaiter(this, void 0, void 0, function* () {
        const endpointElement = yield endpointNode.getElement();
        const device = yield getEndpointDevice(endpointNode);
        endpointElement.currentValue.bind(() => __awaiter(this, void 0, void 0, function* () {
            const newValue = endpointElement.currentValue.get();
            yield sendUpdateRequest(endpointElement, device, newValue);
        }), true);
    }));
}
exports.bindEndpoints = bindEndpoints;
function sendUpdateRequest(endpointElement, device, newValue) {
    return __awaiter(this, void 0, void 0, function* () {
        // const [organNode] = await this.getEndpointOrgan(nodeId);
        // const devices = await this.getDevices(nodeId);
        // const organ = await organNode.element.load();
        // let organ = organNode;
        const request = {
            address: device.info.address.get(),
            deviceId: device.info.idNetwork.get(),
            objectId: { type: endpointElement.typeId.get(), instance: endpointElement.id.get() },
            value: newValue,
        };
        console.log(endpointElement.name.get(), "a changé de value", newValue);
        spinalPilot_1.spinalPilot.sendPilotRequest(request);
        // const spinalPilot = new SpinalPilotModel(organ, requests);
        // await spinalPilot.addToNode(endpointNode);
        // return spinalPilot;
    });
}
function getEndpointDevice(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpointId = endpoint.getId().get();
        if (endpointToDeviceMap.get(endpointId))
            return endpointToDeviceMap.get(endpointId);
        let queue = [endpoint];
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.getType().get() === spinal_model_bmsnetwork_1.SpinalBmsDevice.nodeTypeName) {
                endpointToDeviceMap.set(endpointId, current);
                return current;
            }
            const parents = yield current.getParents([spinal_model_bmsnetwork_1.SpinalBmsDevice.relationName, spinal_model_bmsnetwork_1.SpinalBmsEndpoint.relationName, spinal_model_bmsnetwork_1.SpinalBmsEndpointGroup.relationName]);
            queue.push(...parents);
        }
    });
}
//# sourceMappingURL=utils.js.map