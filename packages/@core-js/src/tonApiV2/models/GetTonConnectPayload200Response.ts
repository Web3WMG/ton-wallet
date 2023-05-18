/* tslint:disable */
/* eslint-disable */
/**
 * REST api to TON blockchain explorer
 * Provide access to indexed TON blockchain
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: contact@fslabs.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface GetTonConnectPayload200Response
 */
export interface GetTonConnectPayload200Response {
    /**
     * 
     * @type {string}
     * @memberof GetTonConnectPayload200Response
     */
    payload: string;
}

/**
 * Check if a given object implements the GetTonConnectPayload200Response interface.
 */
export function instanceOfGetTonConnectPayload200Response(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "payload" in value;

    return isInstance;
}

export function GetTonConnectPayload200ResponseFromJSON(json: any): GetTonConnectPayload200Response {
    return GetTonConnectPayload200ResponseFromJSONTyped(json, false);
}

export function GetTonConnectPayload200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetTonConnectPayload200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'payload': json['payload'],
    };
}

export function GetTonConnectPayload200ResponseToJSON(value?: GetTonConnectPayload200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'payload': value.payload,
    };
}
