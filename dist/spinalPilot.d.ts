import { IRequest } from "spinal-model-bacnet";
declare class SpinalPilot {
    constructor();
    sendPilotRequest(request: IRequest): Promise<boolean>;
    private writeProperty;
    private useDataType;
    private getDataTypes;
}
declare const spinalPilot: SpinalPilot;
export default spinalPilot;
export { spinalPilot };
