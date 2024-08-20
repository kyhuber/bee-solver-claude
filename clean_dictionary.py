# clean_dictionary.py
input_file = 'popular.txt'  # replace with your actual file name
output_file = 'cleaned_popular.txt'

with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
    for word in infile:
        word = word.strip().lower()
        if len(word) >= 4:
            outfile.write(word + '\n')

print(f"Cleaned dictionary saved to {output_file}")