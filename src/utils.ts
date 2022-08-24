import { spinalCore, FileSystem } from "spinal-core-connectorjs_type";
import { SpinalGraph, SpinalContext, SpinalNode } from "spinal-model-graph";
import { SpinalBmsDevice, SpinalBmsEndpoint, SpinalBmsEndpointGroup } from "spinal-model-bmsnetwork";
import { spinalPilot } from "./spinalPilot";

const endpointToDeviceMap = new Map();

export function getGraph(connect: FileSystem, digitaltwin_path: string): Promise<SpinalGraph> {
    return new Promise((resolve, reject) => {
        spinalCore.load(connect, digitaltwin_path, async (graph: SpinalGraph) => {
            resolve(graph);
        }, () => reject("digital twin not found"))
    });
}


export function getAllBmsEndpoint(context: SpinalContext): Promise<SpinalContext[]> {
    return context.findInContextAsyncPredicate(context, async (node) => {
        if (node.getType().get() === SpinalBmsEndpoint.nodeTypeName) {
            await getEndpointDevice(node);
            return true;
        }

        return false
    })
}

export function bindEndpoints(endpoints: SpinalNode[]) {
    const promises = endpoints.map(async endpointNode => {
        const endpointElement = await endpointNode.getElement();
        const device = await getEndpointDevice(endpointNode);

        endpointElement.currentValue.bind(async () => {
            const newValue = endpointElement.currentValue.get();
            await sendUpdateRequest(endpointElement, device, newValue);
        }, true);
    })
}

async function sendUpdateRequest(endpointElement: SpinalBmsEndpoint, device: SpinalNode, newValue) {
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
    spinalPilot.sendPilotRequest(request);

    // const spinalPilot = new SpinalPilotModel(organ, requests);
    // await spinalPilot.addToNode(endpointNode);
    // return spinalPilot;

}


async function getEndpointDevice(endpoint: SpinalNode): Promise<SpinalNode> {
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