import { useState } from "react";
import { getDuration } from "../lib/format";
import type { Span } from "../types/trace";

interface SpanTreeProps {
  spans: Span[];
}

interface TreeNode {
  span: Span;
  children: TreeNode[];
}

interface SpanNodeProps {
  node: TreeNode;
  depth?: number;
}

function buildTree(spans: Span[]): TreeNode[] {
  const nodes = new Map<string, TreeNode>();

  spans.forEach((span) => {
    nodes.set(span.id, {
      span,
      children: [],
    });
  });

  const roots: TreeNode[] = [];

  spans.forEach((span) => {
    const node = nodes.get(span.id);

    if (!node) return;

    if (span.parentSpanId === null) {
      roots.push(node);
      return;
    }

    const parent = nodes.get(span.parentSpanId);

    if (parent) {
      parent.children.push(node);
    }
  });

  return roots;
}

function SpanNode({ node, depth = 0 }: SpanNodeProps) {
  const { span, children } = node;

  const [expanded, setExpanded] = useState(false);

  const hasDetails =
    span.input !== undefined ||
    span.output !== undefined ||
    span.error !== undefined;

  const statusColor =
    span.status === "SUCCESS"
      ? "bg-green-500"
      : span.status === "ERROR"
        ? "bg-red-500"
        : "bg-yellow-500";

  return (
    <div className={depth > 0 ? "relative ml-5 sm:ml-7" : ""}>
      {/* Connector */}
      {depth > 0 && (
        <div className="absolute -left-4 top-0 h-full w-px bg-black/10 sm:-left-5" />
      )}

      <div className="relative">
        {/* Horizontal connector */}
        {depth > 0 && (
          <div className="absolute -left-4 top-6 h-px w-4 bg-black/10 sm:-left-5 sm:w-5" />
        )}

        <button
          type="button"
          onClick={() => {
            if (hasDetails) {
              setExpanded((value) => !value);
            }
          }}
          className={`w-full rounded-xl border p-4 text-left transition ${
            expanded
              ? "border-black/10 bg-[#F5F5EE]"
              : "border-black/5 bg-white hover:border-black/10 hover:shadow-sm"
          }`}
        >
          {/* Top row */}
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${statusColor}`}
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{span.name}</p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span>{span.type}</span>

                  <span>·</span>

                  <span>{getDuration(span.startedAt, span.endedAt)}</span>

                  {span.model && (
                    <>
                      <span>·</span>
                      <span className="truncate">{span.model}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-3 pl-5 text-xs text-gray-400 sm:shrink-0 sm:pl-0">
              {span.inputTokens !== undefined && (
                <span>
                  {span.inputTokens + (span.outputTokens ?? 0)} tokens
                </span>
              )}

              {span.cost !== undefined && <span>${span.cost}</span>}

              {hasDetails && (
                <span className="text-gray-500">{expanded ? "⌃" : "⌄"}</span>
              )}
            </div>
          </div>

          {/* Expanded content */}
          {expanded && (
            <div
              className="mt-4 space-y-4 border-t border-black/5 pt-4"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {span.input !== undefined && (
                <Payload label="Input" value={span.input} />
              )}

              {span.output !== undefined && (
                <Payload label="Output" value={span.output} />
              )}

              {span.error !== undefined && (
                <Payload label="Error" value={span.error} error />
              )}
            </div>
          )}
        </button>
      </div>

      {/* Children */}
      {children.length > 0 && (
        <div className="mt-2 space-y-2">
          {children.map((child) => (
            <SpanNode key={child.span.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface PayloadProps {
  label: string;
  value: unknown;
  error?: boolean;
}

function Payload({ label, value, error = false }: PayloadProps) {
  return (
    <div>
      <p
        className={`mb-2 text-xs font-medium uppercase tracking-wide ${
          error ? "text-red-500" : "text-gray-400"
        }`}
      >
        {label}
      </p>

      <pre className="max-h-80 overflow-auto whitespace-pre-wrap wrap-break-words rounded-lg border border-black/5 bg-white p-3 font-mono text-xs leading-5 text-gray-600">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

export default function SpanTree({ spans }: SpanTreeProps) {
  const tree = buildTree(spans);

  if (tree.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-black/10 p-6 text-center">
        <p className="text-sm text-gray-400">No spans recorded.</p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-2">
      {tree.map((node) => (
        <SpanNode key={node.span.id} node={node} />
      ))}
    </div>
  );
}
