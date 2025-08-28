#!/bin/bash
git clone https://github.com/snd-sweden/research-output-aggregator

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TSV="$DIR/organisations.tsv"

while IFS=$'\t' read -r -a cols || [ -n "${cols[*]}" ]; do
    [[ ${#cols[@]} -eq 0 ]] && continue

    org_slug="${cols[0]}"
    org_name_en="${cols[1]}"
    org_name_sv="${cols[2]}"
    org_ror="${cols[3]}"

    if [ -f "research-output-aggregator/tests/name-lists/$org_slug.txt" ]; then
        name_txt="research-output-aggregator/tests/name-lists/$org_slug.txt"
        echo "Processing ror+txt $org_slug $org_name_en ror: $org_ror"
        python3 ./research-output-aggregator/src/roagg/cli.py --ror "$org_ror" --name-txt "$name_txt" --output "outputs/$org_slug.csv"

    else
        echo "Processing ror $org_slug $org_name_en ror: $org_ror"
        python3 ./research-output-aggregator/src/roagg/cli.py --ror "$org_ror" --output "outputs/$org_slug.csv"
    fi
done < "$TSV"