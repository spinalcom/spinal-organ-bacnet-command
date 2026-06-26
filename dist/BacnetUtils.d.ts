declare class BacnetUtilitiesClass {
    private static instance;
    private _ipcClient;
    private _clientId;
    private constructor();
    static getInstance(): BacnetUtilitiesClass;
    initAndConnect(): Promise<void>;
    private _connectToServer;
    sendPilotRequest(request: any, releasePriority?: boolean): Promise<any>;
    private _sendDataToBacnetServer;
}
declare const BacnetUtilities: BacnetUtilitiesClass;
export default BacnetUtilities;
export { BacnetUtilities };
