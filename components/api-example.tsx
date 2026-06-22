function highlightJson(json: string) {
  const parts: { text: string; color: string }[] = [];
  // Simple tokenizer: strings, numbers, booleans/null, punctuation
  const regex =
    /("(?:[^"\\]|\\.)*")\s*(:)?|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],])/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(json)) !== null) {
    // plain whitespace before this token
    if (match.index > last) {
      parts.push({ text: json.slice(last, match.index), color: "" });
    }

    if (match[1] !== undefined) {
      if (match[2]) {
        // key
        parts.push({ text: match[1], color: "#93c5fd" }); // blue-300
        parts.push({ text: match[2], color: "" });
      } else {
        // string value
        parts.push({ text: match[1], color: "#86efac" }); // green-300
      }
    } else if (match[3] !== undefined) {
      parts.push({ text: match[3], color: "#fca5a5" }); // red-300
    } else if (match[4] !== undefined) {
      parts.push({ text: match[4], color: "#fde68a" }); // amber-200
    } else if (match[5] !== undefined) {
      parts.push({ text: match[5], color: "var(--page-fg-subtle)" });
    }

    last = match.index + match[0].length;
  }

  if (last < json.length) {
    parts.push({ text: json.slice(last), color: "" });
  }

  return parts;
}

const response = `[
  {
    "providerId": "claude",
    "displayName": "Claude",
    "plan": "Team 5x",
    "lines": [
      {
        "type": "progress",
        "label": "Session",
        "used": 7,
        "limit": 100,
        "format": { "kind": "percent" },
        "resetsAt": "2026-03-31T08:00:00.000Z",
        "color": null
      },
      {
        "type": "text",
        "label": "Today",
        "value": "$1.33 \u00b7 4.6M tokens",
        "color": null,
        "subtitle": null
      }
    ],
    "fetchedAt": "2026-03-31T05:19:39.000Z"
  }
]`;

const highlighted = highlightJson(response);

export function ApiExample() {
  return (
    <div
      className="rounded-xl overflow-hidden font-mono text-xs"
      style={{
        backgroundColor: "#0d0f13",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Response */}
      <pre
        className="px-4 py-4 leading-relaxed overflow-x-auto"
        style={{ color: "var(--page-fg-subtle)" }}
      >
        <code>
          {highlighted.map((part, i) =>
            part.color ? (
              <span key={i} style={{ color: part.color }}>
                {part.text}
              </span>
            ) : (
              part.text
            )
          )}
        </code>
      </pre>
    </div>
  );
}
