import { IRequest } from "spinal-model-bacnet";
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";
declare class SpinalPilot {
    client: any;
    constructor();
    queue: any;
    sendPilotRequest(request: IRequest, endpointElement: SpinalBmsEndpoint): Promise<boolean>;
}
declare const spinalPilot: SpinalPilot;
export default spinalPilot;
export { spinalPilot };
