#!/bin/bash
#set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/src"
#yarn upgrade
npm version patch
npm publish