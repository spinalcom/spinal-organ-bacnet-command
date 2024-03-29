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

import { spinalCore, FileSystem } from "spinal-core-connectorjs_type";
import { SpinalGraph, SpinalContext, SpinalNode } from "spinal-model-graph";
import { SpinalBmsDevice, SpinalBmsEndpoint, SpinalBmsEndpointGroup } from "spinal-model-bmsnetwork";
import { spinalPilot } from "./spinalPilot";
import { attributeService } from "spinal-env-viewer-plugin-documentation-service";
import * as _ from "lodash";
import { SpinalAttribute } from "spinal-models-documentation/declarations";
import { IRequest } from "spinal-model-bacnet";
import { IConfigFile } from "./index";
import ConfigFile from "../node_modules/spinal-lib-organ-monitoring/dist/classes/ConfigFile.js"


const ATTRIBUTE_CATEGORY_NAME = "default";
const ATTRIBUTE_NAME = "controlValue";
const DEFAULT_COMMAND_VALUE = "undefined";

const endpointToDeviceMap = new Map();
const isInitiated = {};

export function getGraph(connect: FileSystem, digitaltwin_path: string, config : IConfigFile): Promise<SpinalGraph> {
    return new Promise((resolve, reject) => {
        spinalCore.load(connect, digitaltwin_path, async (graph: SpinalGraph) => {
            ConfigFile.init(connect, config.name + "-config", config.host, config.protocol, parseInt(config.port));
            resolve(graph);
        }, () => reject(new Error(`No digitaltwin found at ${digitaltwin_path}`)))
    });
}

export async function getStartNode(context: SpinalContext, categoryName?: string, groupName?: string): Promise<SpinalNode> {
    let group = null;
    let category = null;

    if (groupName && !categoryName) throw new Error(`"COMMAND_CATEGORY_NAME" is mandatory, when "COMMAND_GROUP_NAME" is specified`);
    if (categoryName && context) {
        category = await _getCategoryByName(context, categoryName);
        if (!category) throw new Error(`no category found for "${categoryName}"`);
    }

    if (groupName && category) {
        group = await _getGroupByName(context, category, groupName);
        if (!group) throw new Error(`no group found for "${groupName}"`);
    }


    return group || category || context;
}

export function getAllBmsEndpoint(startNode: SpinalNode, context?: SpinalContext): Promise<SpinalContext[]> {
    if (!context) context = startNode;
    return startNode.findInContext(context, (node) => {
        if (node.getType().get() === SpinalBmsEndpoint.nodeTypeName) {
            return true;
        }

        return false
    })
}

export async function bindEndpoints(endpoints: SpinalNode[]) {
    const splitedEndpoints = _.chunk(endpoints, 10);

    while (splitedEndpoints.length > 0) {
        const _temp = splitedEndpoints.pop();
        const promises = _temp.map(endpointNode => _bindEndpoint(endpointNode));
        await Promise.all(promises);
    }

}


async function _getCategoryByName(context: SpinalContext, categoryName: string): Promise<SpinalNode> {
    const categories = await context.getChildrenInContext(context);
    return categories.find(el => el.getName().get() === categoryName);
}

async function _getGroupByName(context: SpinalContext, category: SpinalNode, groupName: string): Promise<SpinalNode> {
    const groups = await category.getChildrenInContext(context);
    return groups.find(el => el.getName().get() === groupName);
}

async function _bindEndpoint(endpointNode: SpinalNode) {
    const id = endpointNode.getId().get();
    const modificationDate = endpointNode.info.directModificationDate;

    modificationDate.bind(async () => {
        if (isInitiated[id]) {
            const { controlValue, device, element } = await _getEndpointData(endpointNode);
            const newValue = controlValue.value.get();
            const success = await sendUpdateRequest(element, device, newValue);
            if (success) element.currentValue.set(newValue);
        } else {
            isInitiated[id] = true;
        }
    }, false)
}

async function sendUpdateRequest(endpointElement: SpinalBmsEndpoint, device: SpinalNode, newValue) {
    // const [organNode] = await this.getEndpointOrgan(nodeId);
    // const devices = await this.getDevices(nodeId);

    // const organ = await organNode.element.load();
    // let organ = organNode;
    if (newValue === DEFAULT_COMMAND_VALUE) return;

    if(newValue === "NaN") newValue = null;
    // if(newValue === "NaN_2") newValue = null;

    
    const request: IRequest = {
        address: device.info.address.get(),
        deviceId: device.info.idNetwork.get(),
        objectId: { type: endpointElement.typeId.get(), instance: endpointElement.id.get() },
        value: newValue,
    };

    console.log(newValue != null ? endpointElement.name.get() + ` a changé de value => ${newValue}` : "Priorité relachée pour le : " + endpointElement.name.get());
    return spinalPilot.sendPilotRequest(request);

    // const spinalPilot = new SpinalPilotModel(organ, requests);
    // await spinalPilot.addToNode(endpointNode);
    // return spinalPilot;

}

async function _getEndpointDevice(endpoint: SpinalNode): Promise<SpinalNode> {
    const endpointId = endpoint.getId().get();
    if (endpointToDeviceMap.get(endpointId)) return endpointToDeviceMap.get(endpointId);

    let queue = [endpoint];

    while (queue.length > 0) {
        const current = queue.shift();
        if (current.getType().get() === SpinalBmsDevice.nodeTypeName) {
            endpointToDeviceMap.set(endpointId, current);
            return current;
        }

        const parents = await current.getParents([SpinalBmsDevice.relationName, SpinalBmsEndpoint.relationName, SpinalBmsEndpointGroup.relationName]);
        queue.push(...parents);
    }
}

async function _getEndpointData(endpointNode: SpinalNode): Promise<{ element: SpinalBmsEndpoint, controlValue: SpinalAttribute, device: SpinalNode }> {
    const [element, controlValue, device] = await Promise.all([
        endpointNode.getElement(),
        _getEndpointControlValue(endpointNode),
        _getEndpointDevice(endpointNode)
    ])

    return {
        element,
        controlValue,
        device
    }
}

async function _getEndpointControlValue(endpointNode: SpinalNode): Promise<SpinalAttribute> {
    const [attribute] = await attributeService.getAttributesByCategory(endpointNode, ATTRIBUTE_CATEGORY_NAME, ATTRIBUTE_NAME)
    if (attribute) return attribute;

    return attributeService.addAttributeByCategoryName(endpointNode, ATTRIBUTE_CATEGORY_NAME, ATTRIBUTE_NAME, DEFAULT_COMMAND_VALUE);
}

