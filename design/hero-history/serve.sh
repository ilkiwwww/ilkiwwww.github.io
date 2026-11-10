#!/bin/sh
# Піднімає збірки старих Hero на портах 4181–4185 (v1…v5). Зупинка: Ctrl+C.
cd "$(dirname "$0")"
for n in 1 2 3 4 5; do python3 -m http.server $((4180+n)) -d v$n >/dev/null 2>&1 & done
echo "Hero history: v1..v5 на :4181–:4185 (Ctrl+C — зупинити)"; wait
