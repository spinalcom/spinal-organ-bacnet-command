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

import { IRequest } from "spinal-model-bacnet";
import { SpinalBmsDevice, SpinalBmsEndpoint, SpinalBmsEndpointGroup } from "spinal-model-bmsnetwork";
// import * as bacnet from "bacstack";
const pQueue = require("@esm2cjs/p-queue").default;
const { AbortError } = require("@esm2cjs/p-queue");
import BacnetUtilities from "./BacnetUtils.js";

class SpinalPilot {
   public client = null;
   constructor() {
      // this.client = new bacnet({ adpuTimeout: 10000 });
   }
   queue = new pQueue({ concurrency: 1 });

   public async sendPilotRequest(request: IRequest, endpointElement: SpinalBmsEndpoint): Promise<boolean> {
      try {
         const endpointName = endpointElement.name.get();
         const releasePriority = true;

         const data = await BacnetUtilities.sendPilotRequest(request, releasePriority);
         console.log(request.value != null ? endpointName + ` a changé de value => ${request.value}` : "Priorité relachée pour le : " + endpointName);

         return data;
      } catch (error: any) {
         console.error(error.message);
         return false;
      }
   }

   // private _releasePriority(req: IRequest, dataType: number) {
   //    return new Promise((resolve, reject) => {
   //       //const client = new bacnet();
   //       const value = null;

   //       this.client.writeProperty(req.address, req.objectId, PropertyIds.PROP_PRESENT_VALUE, [{ type: dataType, value: value }], { priority: parseInt(bacnet_priority) }, (err, value) => {
   //          if (err) {
   //             reject(err)
   //             return;
   //          }
   //          resolve(value);
   //       })
   //       // resolve(true)
   //    });
   // }


   // private async writeProperty(req: IRequest, endpointElement: SpinalBmsEndpoint): Promise<boolean> {
   //    const types = this.getDataTypes(req.objectId.type);
   //    let success = false;

   //    console.log("value= ", req.value);

   //    // const client = new bacnet({adpuTimeout: 10000});

   //    while (types.length > 0 && !success) {
   //       const type = types.shift();
   //       try {
   //          // await this.releasePriority(req, type);
   //          await this.useDataType(req, type, this.client);
   //          success = true;
   //       } catch (error) {
   //          //throw error;
   //       }
   //    }

   //    await new Promise(resolve => setTimeout(resolve, 0));
   //    console.log(req.value != null ? endpointElement.name.get() + ` a changé de value => ${req.value}` : "Priorité relachée pour le : " + endpointElement.name.get());
   //    return success;

   // }

   // private useDataType(req: IRequest, dataType: number, client: any) {
   //    return new Promise((resolve, reject) => {
   //       //   const client = new bacnet({adpuTimeout: 10000});
   //       let value = req.value;

   //       if (value != null) {
   //          value = dataType === APPLICATION_TAGS.BACNET_APPLICATION_TAG_ENUMERATED ? (this.convertStringToBool(req.value) ? 1 : 0) : req.value;
   //       }
   //       // console.log("value= ",value);

   //       if (!req.SADR || typeof req.SADR === "object" && Object.keys(req.SADR).length === 0) req.SADR = null;

   //       client.writeProperty(req.address, req.SADR, req.objectId, PropertyIds.PROP_PRESENT_VALUE, [{ type: dataType, value: value }], { priority: parseInt(bacnet_priority) }, (err, value) => {
   //          if (err) {
   //             reject(err)
   //             return;
   //          }
   //          console.log("Success using dataType")
   //          resolve(value);
   //       })
   //       // resolve(true)
   //    });
   // }

   // private convertStringToBool(value: string | number | boolean) {
   //    if (typeof value == "string") {
   //       value = value.toLowerCase();
   //       if (value == "false") return false;
   //       else if (value == "true") return true;

   //    }
   //    return Boolean(value);
   // }

   // private getDataTypes(type: any): number[] {
   //    switch (type) {
   //       case ObjectTypes.OBJECT_ANALOG_INPUT:
   //       case ObjectTypes.OBJECT_ANALOG_OUTPUT:
   //       case ObjectTypes.OBJECT_ANALOG_VALUE:
   //       case ObjectTypes.OBJECT_MULTI_STATE_INPUT:
   //       case ObjectTypes.OBJECT_MULTI_STATE_OUTPUT:
   //       case ObjectTypes.OBJECT_MULTI_STATE_VALUE:
   //          return [
   //             APPLICATION_TAGS.BACNET_APPLICATION_TAG_SIGNED_INT,
   //             APPLICATION_TAGS.BACNET_APPLICATION_TAG_UNSIGNED_INT,
   //             APPLICATION_TAGS.BACNET_APPLICATION_TAG_REAL,
   //             APPLICATION_TAGS.BACNET_APPLICATION_TAG_DOUBLE
   //          ]

   //       case ObjectTypes.OBJECT_BINARY_INPUT:
   //       case ObjectTypes.OBJECT_BINARY_OUTPUT:
   //       case ObjectTypes.OBJECT_BINARY_VALUE:
   //       case ObjectTypes.OBJECT_BINARY_LIGHTING_OUTPUT:
   //          return [
   //             APPLICATION_TAGS.BACNET_APPLICATION_TAG_ENUMERATED,
   //             APPLICATION_TAGS.BACNET_APPLICATION_TAG_BOOLEAN
   //          ]

   //       default:
   //          return [
   //             APPLICATION_TAGS.BACNET_APPLICATION_TAG_OCTET_STRING,
   //             APPLICATION_TAGS.BACNET_APPLICATION_TAG_CHARACTER_STRING,
   //             APPLICATION_TAGS.BACNET_APPLICATION_TAG_BIT_STRING
   //          ]
   //    }
   // }
}


const spinalPilot = new SpinalPilot();


export default spinalPilot;
export { spinalPilot }
