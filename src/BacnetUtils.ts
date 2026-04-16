/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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

import { v4 as uuid } from 'uuid';
import ipc from "node-ipc";
import { SERVICE_NAME, MESSAGE_EVENT_NAME, RESPONSE_EVENT_NAME } from "spinal-bacnet-service";

const bacnet_priority = process.env.BACNET_PRIORITY || "16";


class BacnetUtilitiesClass {

    private static instance: BacnetUtilitiesClass;
    private _ipcClient: any = null;

    private constructor() { }


    public static getInstance(): BacnetUtilitiesClass {
        if (!this.instance) this.instance = new BacnetUtilitiesClass();
        return this.instance;
    }

    public async initAndConnect() {
        this._ipcClient = await this._connectToServer();

        this._ipcClient.on('disconnect', async () => {
            this._ipcClient = await this._connectToServer();
        });

        console.log("connected to bacnet service");
    }

    private _connectToServer() {
        return new Promise((resolve, reject) => {
            const serverServiceName = SERVICE_NAME;
            const clientServiceName = process.env.ORGAN_NAME || "spinal-organ-bacnet";

            ipc.config.id = clientServiceName; // Set the IPC client ID to the organ name or a default value
            ipc.config.retry = 5000; // Retry every 5 seconds if connection to server is lost 
            ipc.config.silent = true; // Disable IPC debug logs

            const bacnetServicePort = process.env.BACNET_SERVICE_PORT?.trim();
            const ipcServerPort = bacnetServicePort ? parseInt(bacnetServicePort) : 47810;

            ipc.connectToNet(serverServiceName, "127.0.0.1", ipcServerPort, () => {
                this._ipcClient = ipc.of[serverServiceName];
                resolve(ipc.of[serverServiceName]);
            });
        });

    }

    public sendPilotRequest(request: any, releasePriority: boolean = false): Promise<any> {
        request.priority = bacnet_priority;
        return this._sendDataToBacnetServer("writeProperty", [request, releasePriority]);
    }

    private _sendDataToBacnetServer(functionName: string, parameters: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = {
                name: functionName,
                id: uuid(),
                parameters: parameters
            };

            this._ipcClient.emit(MESSAGE_EVENT_NAME, (params));

            this._ipcClient.once(`${RESPONSE_EVENT_NAME}_${params.id}`, (response: any) => {
                if (response.status === "error") {
                    return reject({ message: response.error });
                }

                resolve(response.data);
            });
        });
    }

}


const BacnetUtilities = BacnetUtilitiesClass.getInstance();
export default BacnetUtilities;
export { BacnetUtilities };