import { FileSystem } from "spinal-core-connectorjs_type";
import { SpinalGraph, SpinalContext, SpinalNode } from "spinal-model-graph";
export declare function getGraph(connect: FileSystem, digitaltwin_path: string): Promise<SpinalGraph>;
export declare function getAllBmsEndpoint(context: SpinalContext): Promise<SpinalContext[]>;
export declare function bindEndpoints(endpoints: SpinalNode[]): Promise<void>;
