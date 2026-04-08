import { IRequest } from "spinal-model-bacnet";
declare class SpinalPilot {
    private static _instance;
    private _bacnetClient;
    private constructor();
    static getInstance(): SpinalPilot;
    sendPilotRequest(request: IRequest): Promise<boolean>;
    private writeProperty;
    private useDataType;
    private _convertValueToBoolean;
    private getDataTypes;
}
declare const spinalPilot: SpinalPilot;
export default spinalPilot;
export { spinalPilot };
