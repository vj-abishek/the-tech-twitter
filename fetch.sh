#!/bin/bash

# Output file
output_file="output.json"
input_file="content.txt"

heading=""
subheading=""
content=""
link=""
final_json=$(jq -n '[]')

# only generate the json if params has --generate flag

if [[ "$1" != "--generate" ]]; then
  npx remotion studio --props='./output.json'
  exit 0
fi



fetch_tweet() {
     local tweet_id="$1"
     tweet_content=$(
      curl "https://api.brandbird.app/twitter/public/tweets/$tweet_id" \
      -H 'sec-ch-ua: "Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"' \
      -H 'Accept: application/json, text/plain, */*' \
      -H 'Referer: https://www.brandbird.app/' \
      -H 'sec-ch-ua-mobile: ?0' \
      -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' \
     )

    echo $tweet_content
}

# Read the file line by line
while IFS= read -r line; do
  if [[ "$line" == "# "* ]]; then
     current_heading="${line#* }"
  elif [[ "$line" == "## "* ]]; then
    current_subheading="${line##'## '}"
  elif [[ "$line" == *https* ]]; then
    current_link="$line"
    echo "Heading: $current_heading"
    echo "Subheading: $current_subheading"
    echo "Content: $current_content"
    echo "Link: $current_link"
    link_id=$(echo $current_link | awk -F '/' '{print $NF}')
    tweet=$(fetch_tweet "$link_id")
    final_json=$(jq --arg heading "$current_heading" \
                    --arg subheading "$current_subheading" \
                    --arg content "$current_content" \
                    --arg link "$current_link" \
                    --arg id "$link_id" \
                    --argjson tweet "$tweet" \
                    '. += [{"id": $id, "heading": $heading, "subheading": $subheading, "content": $content, "link": $link, "tweet": $tweet}]' <<< "$final_json")
    sleep 2
    current_content=""
    current_link=""
  else
    current_content+="$line"
  fi
done < "$input_file"

echo $final_json > $output_file

 if [ $? -eq 0 ]; then
    echo "Data successfully fetched and saved to $output_file"
    npx remotion studio --props='./output.json'
    # npx remotion render 'src/index.ts' YTShorts --props='./output.json'
else
    echo "Failed to fetch data"
fi


