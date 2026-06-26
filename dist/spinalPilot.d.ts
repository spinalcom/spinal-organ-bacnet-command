import { IRequest } from "spinal-model-bacnet";
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";
declare class SpinalPilot {
    client: any;
    constructor();
    queue: any;
    sendPilotRequest(request: IRequest & {
        priority?: number;
    }, endpointElement: SpinalBmsEndpoint): Promise<boolean>;
    private _getBacnetPriority;
}
declare const spinalPilot: SpinalPilot;
export default spinalPilot;
export { spinalPilot };
