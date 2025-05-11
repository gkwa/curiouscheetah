default:
    @just --list

setup:
    pnpm install
    pnpm run dev

teardown:
    rm -rf node_modules dist

test:
    pnpm test

build:
    pnpm run build

scan-files:
    @echo "Scanning files in the current directory..."
    @find . -type f -not -path '*/node_modules/*' -not -path '*/dist/*' -not -path '*/.git/*' | sort > file-list-tmp.txt
    @echo "{" > file-list.json
    @echo "  \"files\": [" >> file-list.json
    @awk '{printf "    \"%s\"%s\n", $0, (NR==1)?",":""}' file-list-tmp.txt >> file-list.json
    @echo "  ]" >> file-list.json
    @echo "}" >> file-list.json
    @rm file-list-tmp.txt
