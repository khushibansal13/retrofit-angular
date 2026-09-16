import requests
import glob
import json

# Collect 3-5 sample jpg/png images from a test folder
image_files = glob.glob("test_images/*.jpg")[:4]

if len(image_files) < 3:
    print(f"Error: Need at least 3 images in 'test_images' folder. Found {len(image_files)}.")
    exit(1)

files = [('files', (img, open(img, 'rb'), 'image/jpeg')) for img in image_files]

print(f"Sending {len(image_files)} images to API...")
response = requests.post("http://127.0.0.1:8000/api/analyze-door", files=files)

for _, f in files:
    f[1].close()

if response.status_code == 200:
    print("\n--- Aggregated DoorProfile JSON Result ---")
    print(json.dumps(response.json(), indent=2))
else:
    print("Error:", response.status_code, response.text)