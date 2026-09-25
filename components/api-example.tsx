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
      parts.push({ text: match[5], color: "#888888" });
    }

    last = match.index + match[0].length;
  }

  if (last < json.length) {
    parts.push({ text: json.slice(last), color: "" });
  }

  return parts;
}

const response = `{
  "schema": "openusage.limits.v1",
  "providers": {
    "claude": {
      "displayName": "Claude",
      "plan": "Team 5x",
      "stale": false,
      "resources": {
        "weekly": {
          "kind": "consumption",
          "unit": "percent",
          "used": 64,
          "limit": 100,
          "remaining": 36,
          "resetsAt": "2026-09-26T15:00:00.000Z"
        }
      }
    }
  },
  "errors": []
}`;

const highlighted = highlightJson(response);

export function ApiExample() {
  return (
    <div className="overflow-hidden rounded-2xl bg-ink font-mono text-xs">
      <pre className="overflow-x-auto p-5 leading-relaxed text-muted">
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
