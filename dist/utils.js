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
exports.bindEndpoints = exports.getAllBmsEndpoint = exports.getStartNode = exports.getGraph = exports.EndPointProcess = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const spinalPilot_js_1 = require("./spinalPilot.js");
const spinal_env_viewer_plugin_documentation_service_1 = require("spinal-env-viewer-plugin-documentation-service");
const spinal_lib_organ_monitoring_1 = __importDefault(require("spinal-lib-organ-monitoring"));
const ATTRIBUTE_CATEGORY_NAME = "default";
const ATTRIBUTE_NAME = "controlValue";
const DEFAULT_COMMAND_VALUE = "undefined";
const endpointToDeviceMap = new Map();
const isInitiated = {};
class EndPointProcess extends spinal_core_connectorjs_type_1.Process {
    constructor(models, onchange_construction, f) {
        super(models.map(m => m.modelToBind), onchange_construction);
        this.mapData = models;
        this.f = f;
    }
    onchange() {
        for (const { modelToBind, modelInCb } of this.mapData) {
            if (modelToBind.has_been_directly_modified())
                this.f(modelInCb);
        }
    }
}
exports.EndPointProcess = EndPointProcess;
EndPointProcess._constructorName = 'EndPointProcess';
function getGraph(connect, digitaltwin_path, config) {
    return new Promise((resolve, reject) => {
        spinal_core_connectorjs_type_1.spinalCore.load(connect, digitaltwin_path, (graph) => __awaiter(this, void 0, void 0, function* () {
            spinal_lib_organ_monitoring_1.default.init(connect, config.name, config.host, config.protocol, parseInt(config.port));
            resolve(graph);
        }), () => reject(new Error(`No digitaltwin found at ${digitaltwin_path}`)));
    });
}
exports.getGraph = getGraph;
function getStartNode(context, categoryName, groupName) {
    return __awaiter(this, void 0, void 0, function* () {
        let group = null;
        let category = null;
        if (groupName && !categoryName)
            throw new Error(`"COMMAND_CATEGORY_NAME" is mandatory, when "COMMAND_GROUP_NAME" is specified`);
        if (categoryName && context) {
            category = yield _getCategoryByName(context, categoryName);
            if (!category)
                throw new Error(`no category found for "${categoryName}"`);
        }
        if (groupName && category) {
            group = yield _getGroupByName(context, category, groupName);
            if (!group)
                throw new Error(`no group found for "${groupName}"`);
        }
        return group || category || context;
    });
}
exports.getStartNode = getStartNode;
function getAllBmsEndpoint(startNode, context) {
    if (!context)
        context = startNode;
    return startNode.findInContext(context, (node) => {
        if (node.getType().get() === spinal_model_bmsnetwork_1.SpinalBmsEndpoint.nodeTypeName) {
            return true;
        }
        return false;
    });
}
exports.getAllBmsEndpoint = getAllBmsEndpoint;
function bindEndpoints(endpoints) {
    return __awaiter(this, void 0, void 0, function* () {
        // const splitedEndpoints = _.chunk(endpoints, 10);
        // while (splitedEndpoints.length > 0) {
        //     const _temp = splitedEndpoints.pop();
        //     // const promises = _temp.map(endpointNode => _bindEndpoint(endpointNode));
        //     // await Promise.all(promises);
        // }
        // const id = endpointNode.getId().get();
        // const modificationDate = endpointNode.info.directModificationDate;
        // modificationDate.bind(async () => {
        //     if (isInitiated[id]) {
        //         const { controlValue, device, element } = await _getEndpointData(endpointNode);
        //         const newValue = controlValue.value.get();
        //         const success = await sendUpdateRequest(element, device, newValue);
        //         if (success) element.currentValue.set(newValue);
        //     } else {
        //         isInitiated[id] = true;
        //     }
        // }, false)
        const endpointsData = endpoints.map((e) => ({ modelToBind: e.info.directModificationDate, modelInCb: e }));
        new EndPointProcess(endpointsData, true, (endpointNode) => __awaiter(this, void 0, void 0, function* () {
            const id = endpointNode.getId().get();
            if (isInitiated[id]) {
                const { controlValue, device, element } = yield _getEndpointData(endpointNode);
                const newValue = controlValue.value.get();
                const success = yield sendUpdateRequest(element, device, newValue);
                if (success)
                    element.currentValue.set(newValue);
            }
            else {
                yield _getEndpointControlValue(endpointNode); // on s'assure que l'attribut de controlValue est créé avant de binder le listener, pour éviter les problèmes
                isInitiated[id] = true;
            }
        }));
    });
}
exports.bindEndpoints = bindEndpoints;
function _getCategoryByName(context, categoryName) {
    return __awaiter(this, void 0, void 0, function* () {
        const categories = yield context.getChildrenInContext(context);
        return categories.find(el => el.getName().get() === categoryName);
    });
}
function _getGroupByName(context, category, groupName) {
    return __awaiter(this, void 0, void 0, function* () {
        const groups = yield category.getChildrenInContext(context);
        return groups.find(el => el.getName().get() === groupName);
    });
}
// async function _bindEndpoint(endpointNode: SpinalNode) {
//     const id = endpointNode.getId().get();
//     const modificationDate = endpointNode.info.directModificationDate;
//     modificationDate.bind(async () => {
//         if (isInitiated[id]) {
//             const { controlValue, device, element } = await _getEndpointData(endpointNode);
//             const newValue = controlValue.value.get();
//             const success = await sendUpdateRequest(element, device, newValue);
//             if (success) element.currentValue.set(newValue);
//         } else {
//             isInitiated[id] = true;
//         }
//     }, false)
// }
function sendUpdateRequest(endpointElement, device, newValue) {
    return __awaiter(this, void 0, void 0, function* () {
        // const [organNode] = await this.getEndpointOrgan(nodeId);
        // const devices = await this.getDevices(nodeId);
        // const organ = await organNode.element.load();
        // let organ = organNode;
        if (newValue === DEFAULT_COMMAND_VALUE)
            return;
        if (newValue === "NaN")
            newValue = null;
        // if(newValue === "NaN_2") newValue = null;
        const request = {
            address: device.info.address.get(),
            deviceId: device.info.idNetwork.get(),
            objectId: { type: endpointElement.typeId.get(), instance: endpointElement.id.get() },
            value: newValue,
        };
        // console.log(newValue != null ? endpointElement.name.get() + ` a changé de value => ${newValue}` : "Priorité relachée pour le : " + endpointElement.name.get());
        return spinalPilot_js_1.spinalPilot.sendPilotRequest(request, endpointElement);
        // const spinalPilot = new SpinalPilotModel(organ, requests);
        // await spinalPilot.addToNode(endpointNode);
        // return spinalPilot;
    });
}
function _getEndpointDevice(endpoint) {
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
function _getEndpointData(endpointNode) {
    return __awaiter(this, void 0, void 0, function* () {
        const [element, controlValue, device] = yield Promise.all([
            endpointNode.getElement(),
            _getEndpointControlValue(endpointNode),
            _getEndpointDevice(endpointNode)
        ]);
        return {
            element,
            controlValue,
            device
        };
    });
}
function _getEndpointControlValue(endpointNode) {
    return __awaiter(this, void 0, void 0, function* () {
        const [attribute] = yield spinal_env_viewer_plugin_documentation_service_1.attributeService.getAttributesByCategory(endpointNode, ATTRIBUTE_CATEGORY_NAME, ATTRIBUTE_NAME);
        if (attribute)
            return attribute;
        return spinal_env_viewer_plugin_documentation_service_1.attributeService.addAttributeByCategoryName(endpointNode, ATTRIBUTE_CATEGORY_NAME, ATTRIBUTE_NAME, DEFAULT_COMMAND_VALUE);
    });
}
//# sourceMappingURL=utils.js.map