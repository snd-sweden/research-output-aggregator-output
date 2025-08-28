
#!/bin/bash
# Combines all CSV files in the outputs directory into one CSV file, adding a column with the source file name (without .csv extension)

OUTPUT_FILE="combined-outputs.csv"
OUTPUTS_DIR="outputs"

# Get the header from the first file and add the new column name as the first column
first_file=$(find "$OUTPUTS_DIR" -type f -name '*.csv' | head -n 1)
if [ -z "$first_file" ]; then
	echo "No CSV files found in $OUTPUTS_DIR."
	exit 1
fi
header=$(head -n 1 "$first_file")
echo "source,$header" > "$OUTPUT_FILE"

# Loop through all CSV files and append their rows with the source column as the first column
for file in "$OUTPUTS_DIR"/*.csv; do
	fname=$(basename "$file" .csv)
	# Skip header, add source column as first column, and append to output
	tail -n +2 "$file" | awk -v src="$fname" -F',' 'BEGIN{OFS=","} {print src,$0}' >> "$OUTPUT_FILE"
done

echo "Combined CSV written to $OUTPUT_FILE"
