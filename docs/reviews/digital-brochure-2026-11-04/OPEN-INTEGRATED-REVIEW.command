#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/../../.."
review_url="http://localhost:3000/preview/integrated"
log_file="/tmp/pfm-integrated-review-dev.log"

if curl --silent --fail --max-time 2 "$review_url" >/dev/null; then
  open "$review_url"
  exit 0
fi

npm run dev >"$log_file" 2>&1 &
server_pid=$!
cleanup() {
  kill "$server_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

for _ in {1..60}; do
  if curl --silent --fail --max-time 2 "$review_url" >/dev/null; then
    open "$review_url"
    echo "Integrated review is open. Keep this Terminal window open while reviewing."
    wait "$server_pid"
    exit 0
  fi
  if ! kill -0 "$server_pid" 2>/dev/null; then
    cat "$log_file"
    exit 1
  fi
  sleep 1
done

cat "$log_file"
echo "The local review server did not start within 60 seconds."
exit 1
