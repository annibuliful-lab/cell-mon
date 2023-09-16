import api from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { config } from 'dotenv';

config();

export function tracerProvider(serviceName: string) {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
    }),
  });

  const graphQLInstrumentation = new GraphQLInstrumentation();
  graphQLInstrumentation.setTracerProvider(provider);
  graphQLInstrumentation.enable();

  api.propagation.setGlobalPropagator(new W3CTraceContextPropagator());
  api.trace.setGlobalTracerProvider(provider);

  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new OTLPTraceExporter({ url: process.env.OTLP_TRACE_ENDPOINT })
    )
  );

  provider.register();
  return provider;
}
