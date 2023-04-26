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

import * as path from "path";
import { getGraph, getStartNode, getAllBmsEndpoint, bindEndpoints } from "./utils";
import { SpinalContext } from "spinal-model-graph";
import { spinalCore, FileSystem } from "spinal-core-connectorjs_type";

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

export interface IConfigFile{
    name : string,
    host: string,
    protocol: string,
    port : string
}

const userId = process.env.USER_ID;
const password = process.env.PASSWORD;
const protocol = process.env.PROTOCOL;
const host = process.env.HOST;
const port = process.env.PORT;
const command_context_name = process.env.COMMAND_CONTEXT_NAME;
const command_category_name = process.env.COMMAND_CATEGORY_NAME;
const command_group_name = process.env.COMMAND_GROUP_NAME;
const digitaltwin_path = process.env.DIGITAL_TWIN_PATH;
const organ_name = process.env.ORGAN_NAME;


const url = `${protocol}://${userId}:${password}@${host}:${port}/`;
const connect = spinalCore.connect(url);
let config : IConfigFile={
    name: organ_name,
    host: host,
    protocol : protocol,
    port: port
};

// Cette fonction est executée en cas de deconnexion au hub
FileSystem.onConnectionError = (error_code: number) => {
    console.log("redemarrage");
    process.exit(error_code); // kill le process;
}

getGraph(connect, digitaltwin_path, config).then(async (graph) => {
    const context: SpinalContext = await graph.getContext(command_context_name);
    if (!context) throw new Error(`No context found for "${command_context_name}"`);

    const startNode = await getStartNode(context, command_category_name, command_group_name)

    console.log("getting bmsEndpoints...")
    const bmsEndpoints = await getAllBmsEndpoint(startNode, context);
    console.log(bmsEndpoints.length, "endpoint(s) found");

    console.log("binding...")
    await bindEndpoints(bmsEndpoints);
    console.log("** Done **")

}).catch(err => {
    console.error(err.message || err)
    process.exit(0);
})