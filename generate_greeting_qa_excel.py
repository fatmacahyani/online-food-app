import pandas as pd

# Define greeting question-answer pairs
greeting_qa_pairs = [
    ("Hi there!", "Hello! How can I assist you today?"),
    ("Hello!", "Hi! What can I do for you?"),
    ("Good morning!", "Good morning! How can I help you?"),
    ("Good afternoon!", "Good afternoon! How may I assist you?"),
    ("Good evening!", "Good evening! How can I be of service?"),
    # Add more pairs up to 50
]

# Create a DataFrame
df = pd.DataFrame(greeting_qa_pairs, columns=["Question", "Answer"])

# Save the DataFrame to an Excel file
output_file = "greeting_qa_pairs.xlsx"
df.to_excel(output_file, index=False, engine='openpyxl')

print(f"Excel file '{output_file}' created successfully with greeting question-answer pairs.")