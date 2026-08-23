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
}

function SpanNode({ node }: SpanNodeProps) {
  const { span, children } = node;
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="ml-4 border-l pl-4">
      <div
        onClick={() => setExpanded((value) => !value)}
        className="cursor-pointer rounded-lg border bg-white p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{span.name}</h3>

            <p className="text-sm text-gray-500">{span.type}</p>
          </div>

          <span className="text-sm">{span.status}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>{span.type}</span>

          <span>{getDuration(span.startedAt, span.endedAt)}</span>

          {span.model && <span>Model: {span.model}</span>}

          {span.provider && <span>Provider: {span.provider}</span>}

          {span.inputTokens !== undefined && (
            <span>Input: {span.inputTokens}</span>
          )}

          {span.outputTokens !== undefined && (
            <span>Output: {span.outputTokens}</span>
          )}

          {span.cost !== undefined && <span>Cost: ${span.cost}</span>}
        </div>
        {expanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {span.input !== undefined && (
              <div>
                <h4 className="mb-2 font-semibold">Input</h4>

                <pre className="overflow-auto rounded bg-gray-100 p-3 text-sm">
                  {JSON.stringify(span.input, null, 2)}
                </pre>
              </div>
            )}

            {span.output !== undefined && (
              <div>
                <h4 className="mb-2 font-semibold">Output</h4>

                <pre className="overflow-auto rounded bg-gray-100 p-3 text-sm">
                  {JSON.stringify(span.output, null, 2)}
                </pre>
              </div>
            )}

            {span.error !== undefined && (
              <div>
                <h4 className="mb-2 font-semibold">Error</h4>

                <pre className="overflow-auto rounded bg-gray-100 p-3 text-sm">
                  {JSON.stringify(span.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {children.length > 0 && (
        <div className="mt-3 space-y-3">
          {children.map((child) => (
            <SpanNode key={child.span.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function buildTree(spans: Span[]): TreeNode[] {
  const nodes = new Map<string, TreeNode>();

  // Create a TreeNode for every span
  spans.forEach((span) => {
    nodes.set(span.id, {
      span,
      children: [],
    });
  });

  const roots: TreeNode[] = [];

  // Connect children to their parents
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

export default function SpanTree({ spans }: SpanTreeProps) {
  const tree = buildTree(spans);

  return (
    <div className="mt-6 space-y-3">
      {tree.map((node) => (
        <SpanNode key={node.span.id} node={node} />
      ))}
    </div>
  );
}
