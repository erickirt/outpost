/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { collectExtraKeys as collectExtraKeys$ } from "../../lib/schemas.js";
import { OutpostError } from "./outposterror.js";

/**
 * Status codes relating to the resource/entity they are requesting not being found or endpoints/routes not existing
 */
export type NotFoundErrorData = {
  message?: string | undefined;

  additionalProperties: { [k: string]: any };
};

/**
 * Status codes relating to the resource/entity they are requesting not being found or endpoints/routes not existing
 */
export class NotFoundError extends OutpostError {
  additionalProperties: { [k: string]: any } = {};

  /** The original data that was passed to this error instance. */
  data$: NotFoundErrorData;

  constructor(
    err: NotFoundErrorData,
    httpMeta: { response: Response; request: Request; body: string },
  ) {
    const message = err.message || `API error occurred: ${JSON.stringify(err)}`;
    super(message, httpMeta);
    this.data$ = err;
    if (err.additionalProperties != null) {
      this.additionalProperties = err.additionalProperties;
    }

    this.name = "NotFoundError";
  }
}

/** @internal */
export const NotFoundError$inboundSchema: z.ZodType<
  NotFoundError,
  z.ZodTypeDef,
  unknown
> = collectExtraKeys$(
  z.object({
    message: z.string().optional(),
    request$: z.instanceof(Request),
    response$: z.instanceof(Response),
    body$: z.string(),
  })
    .catchall(z.any()),
  "additionalProperties",
  true,
)
  .transform((v) => {
    return new NotFoundError(v, {
      request: v.request$,
      response: v.response$,
      body: v.body$,
    });
  });

/** @internal */
export type NotFoundError$Outbound = {
  message?: string | undefined;
  [additionalProperties: string]: unknown;
};

/** @internal */
export const NotFoundError$outboundSchema: z.ZodType<
  NotFoundError$Outbound,
  z.ZodTypeDef,
  NotFoundError
> = z.instanceof(NotFoundError)
  .transform(v => v.data$)
  .pipe(
    z.object({
      message: z.string().optional(),
      additionalProperties: z.record(z.any()),
    }).transform((v) => {
      return {
        ...v.additionalProperties,
        ...remap$(v, {
          additionalProperties: null,
        }),
      };
    }),
  );

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace NotFoundError$ {
  /** @deprecated use `NotFoundError$inboundSchema` instead. */
  export const inboundSchema = NotFoundError$inboundSchema;
  /** @deprecated use `NotFoundError$outboundSchema` instead. */
  export const outboundSchema = NotFoundError$outboundSchema;
  /** @deprecated use `NotFoundError$Outbound` instead. */
  export type Outbound = NotFoundError$Outbound;
}
