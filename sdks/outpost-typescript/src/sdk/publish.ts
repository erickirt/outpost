/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { publishEvent } from "../funcs/publishEvent.js";
import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as components from "../models/components/index.js";
import { unwrapAsync } from "../types/fp.js";

export class Publish extends ClientSDK {
  /**
   * Publish Event
   *
   * @remarks
   * Publishes an event to the specified topic, potentially routed to a specific destination. Requires Admin API Key.
   */
  async event(
    request: components.PublishRequest,
    options?: RequestOptions,
  ): Promise<components.PublishResponse> {
    return unwrapAsync(publishEvent(
      this,
      request,
      options,
    ));
  }
}
