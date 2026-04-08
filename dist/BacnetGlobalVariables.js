"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNITS_TYPES = exports.ObjectTypesCode = exports.PropertyNames = exports.SEGMENTATIONS = exports.APPLICATION_TAGS = exports.ENUM_DISABLE = exports.PropertyIds = exports.ObjectTypes = void 0;
const bacnetEnum_1 = require("./bacnetEnum");
exports.ObjectTypes = bacnetEnum_1.default.ObjectTypes;
exports.PropertyIds = bacnetEnum_1.default.PropertyIds;
exports.ENUM_DISABLE = bacnetEnum_1.default.EnableDisable;
exports.APPLICATION_TAGS = bacnetEnum_1.default.ApplicationTags;
exports.SEGMENTATIONS = bacnetEnum_1.default.Segmentations;
exports.PropertyNames = swapObject(bacnetEnum_1.default.PropertyIds);
exports.ObjectTypesCode = swapObject(bacnetEnum_1.default.ObjectTypes);
exports.UNITS_TYPES = swapObject(bacnetEnum_1.default.UnitsId);
function swapObject(json) {
    const swapped = {};
    for (const key in json) {
        const value = json[key];
        swapped[value] = key;
    }
    return swapped;
}
//# sourceMappingURL=BacnetGlobalVariables.js.map