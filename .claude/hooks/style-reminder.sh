#!/bin/sh
# style-reminder — a UserPromptSubmit hook that keeps custom output styles enforced.
#
# Claude Code injects a per-turn reminder ("<Name> output style is active.
# Remember to follow the specific guidelines for this style.") ONLY for its
# built-in styles (Proactive, Explanatory, Learning). Custom styles are placed
# in the system prompt once and never reinforced, so their voice fades in long
# sessions. This hook emits the exact same reminder line for whatever custom
# style is active, closing that gap.
#
# Install: install.sh --enforce   (or copy this file and register it under
# hooks.UserPromptSubmit in ~/.claude/settings.json)

settings="${CLAUDE_DIR:-$HOME/.claude}/settings.json"
[ -f "$settings" ] || exit 0

style=""
for py in python3 python; do
  if command -v "$py" >/dev/null 2>&1; then
    style=$("$py" -c 'import json,sys
try:
    print(json.load(open(sys.argv[1])).get("outputStyle") or "")
except Exception:
    pass' "$settings" 2>/dev/null)
    [ -n "$style" ] && break
  fi
done
if [ -z "$style" ]; then
  style=$(sed -n 's/.*"outputStyle"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$settings" | head -1)
fi

# Built-ins already get this reminder from Claude Code itself.
case "$style" in
  ""|default|Proactive|Explanatory|Learning) exit 0 ;;
esac

echo "$style output style is active. Remember to follow the specific guidelines for this style."
