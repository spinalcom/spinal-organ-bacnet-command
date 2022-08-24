
import { getGraph, getAllBmsEndpoint, bindEndpoints } from "./utils";
import { SpinalContext } from "spinal-model-graph";
import { spinalCore, FileSystem } from "spinal-core-connectorjs_type";

const config = require("../config.js");

const { protocol, host, port, userId, password, command_context_name, digitaltwin_path } = config.spinalConnector;
const url = `${protocol}://${userId}:${password}@${host}:${port}/`;
const connect = spinalCore.connect(url);


getGraph(connect,digitaltwin_path).then(async (graph) => {
    const context : SpinalContext = await graph.getContext(command_context_name);
    console.log("getting bmsEndpoints...")
    const bmsEndpoints = await getAllBmsEndpoint(context);
    console.log(bmsEndpoints.length, "endpoint(s) found");

    bindEndpoints(bmsEndpoints);   
})