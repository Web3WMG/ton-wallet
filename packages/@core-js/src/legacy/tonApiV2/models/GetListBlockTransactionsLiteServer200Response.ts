/* tslint:disable */
/* eslint-disable */
/**
 * REST api to TON blockchain explorer
 * Provide access to indexed TON blockchain
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: support@tonkeeper.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { BlockRaw } from './BlockRaw';
import {
    BlockRawFromJSON,
    BlockRawFromJSONTyped,
    BlockRawToJSON,
} from './BlockRaw';
import type { GetListBlockTransactionsLiteServer200ResponseIdsInner } from './GetListBlockTransactionsLiteServer200ResponseIdsInner';
import {
    GetListBlockTransactionsLiteServer200ResponseIdsInnerFromJSON,
    GetListBlockTransactionsLiteServer200ResponseIdsInnerFromJSONTyped,
    GetListBlockTransactionsLiteServer200ResponseIdsInnerToJSON,
} from './GetListBlockTransactionsLiteServer200ResponseIdsInner';

/**
 * 
 * @export
 * @interface GetListBlockTransactionsLiteServer200Response
 */
export interface GetListBlockTransactionsLiteServer200Response {
    /**
     * 
     * @type {BlockRaw}
     * @memberof GetListBlockTransactionsLiteServer200Response
     */
    id: BlockRaw;
    /**
     * 
     * @type {number}
     * @memberof GetListBlockTransactionsLiteServer200Response
     */
    reqCount: number;
    /**
     * 
     * @type {boolean}
     * @memberof GetListBlockTransactionsLiteServer200Response
     */
    incomplete: boolean;
    /**
     * 
     * @type {Array<GetListBlockTransactionsLiteServer200ResponseIdsInner>}
     * @memberof GetListBlockTransactionsLiteServer200Response
     */
    ids: Array<GetListBlockTransactionsLiteServer200ResponseIdsInner>;
    /**
     * 
     * @type {string}
     * @memberof GetListBlockTransactionsLiteServer200Response
     */
    proof: string;
}

/**
 * Check if a given object implements the GetListBlockTransactionsLiteServer200Response interface.
 */
export function instanceOfGetListBlockTransactionsLiteServer200Response(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "reqCount" in value;
    isInstance = isInstance && "incomplete" in value;
    isInstance = isInstance && "ids" in value;
    isInstance = isInstance && "proof" in value;

    return isInstance;
}

export function GetListBlockTransactionsLiteServer200ResponseFromJSON(json: any): GetListBlockTransactionsLiteServer200Response {
    return GetListBlockTransactionsLiteServer200ResponseFromJSONTyped(json, false);
}

export function GetListBlockTransactionsLiteServer200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetListBlockTransactionsLiteServer200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': BlockRawFromJSON(json['id']),
        'reqCount': json['req_count'],
        'incomplete': json['incomplete'],
        'ids': ((json['ids'] as Array<any>).map(GetListBlockTransactionsLiteServer200ResponseIdsInnerFromJSON)),
        'proof': json['proof'],
    };
}

export function GetListBlockTransactionsLiteServer200ResponseToJSON(value?: GetListBlockTransactionsLiteServer200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': BlockRawToJSON(value.id),
        'req_count': value.reqCount,
        'incomplete': value.incomplete,
        'ids': ((value.ids as Array<any>).map(GetListBlockTransactionsLiteServer200ResponseIdsInnerToJSON)),
        'proof': value.proof,
    };
}
