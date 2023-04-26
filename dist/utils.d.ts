import { FileSystem } from "spinal-core-connectorjs_type";
import { SpinalGraph, SpinalContext, SpinalNode } from "spinal-model-graph";
import { IConfigFile } from "./index";
export declare function getGraph(connect: FileSystem, digitaltwin_path: string, config: IConfigFile): Promise<SpinalGraph>;
export declare function getStartNode(context: SpinalContext, categoryName?: string, groupName?: string): Promise<SpinalNode>;
export declare function getAllBmsEndpoint(startNode: SpinalNode, context?: SpinalContext): Promise<SpinalContext[]>;
export declare function bindEndpoints(endpoints: SpinalNode[]): Promise<void>;
