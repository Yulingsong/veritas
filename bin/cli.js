#!/bin/sh
cd "$(dirname "$0")"
exec node dist/cli/index.js "$@"
