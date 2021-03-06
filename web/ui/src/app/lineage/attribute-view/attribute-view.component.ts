/*
 * Copyright 2017 Barclays Africa Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, Input, OnInit} from "@angular/core";
import {IAttribute, IDataType, IArrayType, IStructType} from "../../../generated-ts/lineage-model";
import * as _ from "lodash";
import {TreeNode} from "angular-tree-component";
import {typeOfDataType} from "../types";

@Component({
    selector: "attribute-view",
    templateUrl: "attribute-view.component.html",
    styleUrls: ["attribute-view.component.css"]
})
export class AttributeViewComponent implements OnInit {
    @Input() attr: IAttribute

    attrTree: any[] // there is no according 'd.ts' for the input tree node in the angular tree component

    treeOptions = {
        allowDrag: false,
        allowDrop: _.constant(false)
    }

    ngOnInit(): void {
        this.attrTree = this.buildAttrTree(this.attr)
    }

    private buildAttrTree(attr: IAttribute): any[] {
        let seq = 0

        function buildChildren(dt: IDataType): (any[] | undefined) {
            let dtt = typeOfDataType(dt)
            return (dtt == "SimpleType") ? undefined
                : (dtt == "StructType") ? buildChildrenForStructType(<IStructType> dt)
                    : buildChildren((<IArrayType> dt).elementDataType)
        }

        function buildChildrenForStructType(sdt: IStructType): any[] {
            return sdt.fields.map(f => buildNode(f.dataType, f.name))
        }

        function buildNode(dt: IDataType, name: string) {
            return {
                id: seq++,
                name: name,
                type: dt,
                children: buildChildren(dt)
            }
        }

        return [buildNode(attr.dataType, attr.name)]
    }

    toggleExpand(node: TreeNode, doExpand: boolean) {
        if (doExpand) node.expand()
        else node.collapse()
    }
}