import { FileSystem, Process, Model } from "spinal-core-connectorjs_type";
import { SpinalGraph, SpinalContext, SpinalNode } from "spinal-model-graph";
import { IConfigFile } from "./index.js";
type cbProcessData = {
    modelToBind: Model;
    modelInCb: SpinalNode;
};
export declare class EndPointProcess extends Process {
    static _constructorName: string;
    f: (model: SpinalNode) => void;
    mapData: cbProcessData[];
    constructor(models: cbProcessData[], onchange_construction: boolean, f: (model: SpinalNode) => void);
    onchange(): void;
}
export declare function getGraph(connect: FileSystem, digitaltwin_path: string, config: IConfigFile): Promise<SpinalGraph>;
export declare function getStartNode(context: SpinalContext, categoryName?: string, groupName?: string): Promise<SpinalNode>;
export declare function getAllBmsEndpoint(startNode: SpinalNode, context?: SpinalContext): Promise<SpinalContext[]>;
export declare function bindEndpoints(endpoints: SpinalNode[]): Promise<void>;
export {};
