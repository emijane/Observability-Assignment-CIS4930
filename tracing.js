// tracing.js

const { resourceFromAttributes } = require("@opentelemetry/resources");
const { ATTR_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
    getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

// Traces → Jaeger via OTLP HTTP
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

// Metrics (optional: just log to console)
const {
    ConsoleMetricExporter,
    PeriodicExportingMetricReader,
} = require("@opentelemetry/sdk-metrics");

// Instrumentations
const { ExpressInstrumentation } =
    require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } =
    require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } =
    require("@opentelemetry/instrumentation-http");

const traceExporter = new OTLPTraceExporter({
    url: "http://127.0.0.1:4318/v1/traces", // Jaeger OTLP HTTP endpoint
});

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: "todo-service",
    }),
    traceExporter,
    metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
    }),
    instrumentations: [
        getNodeAutoInstrumentations(),
        new ExpressInstrumentation(),
        new MongoDBInstrumentation(), // harmless even if you’re not using Mongo
        new HttpInstrumentation(),
    ],
});

// In your SDK version, start() is sync/void, so just call it:
try {
    sdk.start();
    console.log("OpenTelemetry SDK started");
} catch (err) {
    console.error("Error starting OpenTelemetry SDK", err);
}
