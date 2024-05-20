import { IRequest } from "spinal-model-bacnet";
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";
declare class SpinalPilot {
    constructor();
    queue: any;
    sendPilotRequest(request: IRequest, endpointElement: SpinalBmsEndpoint): Promise<boolean>;
    private writeProperty;
    private useDataType;
    private releasePriority;
    private getDataTypes;
}
declare const spinalPilot: SpinalPilot;
export default spinalPilot;
export { spinalPilot };
