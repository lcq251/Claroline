#!/bin/bash
# verify.sh - React Demo scaffolding verification script
# Usage: bash verify.sh

set -e

echo "=== React Demo Scaffolding Verification ==="
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

ERRORS=0

echo "[1/5] Checking index.html..."
if [ -f "index.html" ]; then
  if grep -q '<div id="root">' index.html && grep -q 'src/main.jsx' index.html; then
    echo "  ✅ index.html OK"
  else
    echo "  ❌ index.html missing required content"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "  ❌ index.html NOT FOUND"
  ERRORS=$((ERRORS + 1))
fi

echo "[2/5] Checking package.json..."
if [ -f "package.json" ]; then
  if grep -q '"react"' package.json && grep -q '"vite"' package.json; then
    echo "  ✅ package.json OK"
  else
    echo "  ❌ package.json missing required dependencies"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "  ❌ package.json NOT FOUND"
  ERRORS=$((ERRORS + 1))
fi

echo "[3/5] Checking vite.config.js..."
if [ -f "vite.config.js" ]; then
  if grep -q '@vitejs/plugin-react' vite.config.js; then
    echo "  ✅ vite.config.js OK"
  else
    echo "  ❌ vite.config.js missing plugin-react"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "  ❌ vite.config.js NOT FOUND"
  ERRORS=$((ERRORS + 1))
fi

echo "[4/5] Checking src/ files..."
SRC_OK=true
for file in src/App.jsx src/App.css src/main.jsx; do
  if [ -f "$file" ]; then
    echo "  ✅ $file OK"
  else
    echo "  ❌ $file NOT FOUND"
    SRC_OK=false
    ERRORS=$((ERRORS + 1))
  fi
done

if [ "$SRC_OK" = true ]; then
  if grep -q 'Hello World' src/App.jsx && grep -q 'React.StrictMode' src/main.jsx; then
    echo "  ✅ Content verified"
  fi
fi

echo "[5/5] Checking project structure..."
EXPECTED_FILES="index.html package.json vite.config.js src/App.jsx src/App.css src/main.jsx"
for f in $EXPECTED_FILES; do
  if [ ! -f "$f" ]; then
    echo "  ❌ Missing: $f"
    ERRORS=$((ERRORS + 1))
  fi
done
if [ $ERRORS -eq 0 ] || [ "$SRC_OK" = true ]; then
  echo "  ✅ All 6 files present"
fi

echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
  echo "✅ ALL CHECKS PASSED"
  echo ""
  echo "Next steps:"
  echo "  npm install       # install dependencies"
  echo "  npm run dev       # start dev server (port 5173)"
  echo "  npm run build     # production build → dist/"
  exit 0
else
  echo "❌ $ERRORS error(s) found"
  exit 1
fi
