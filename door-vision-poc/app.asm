import streamlit as st
import requests
import json

st.set_page_config(page_title="DoorVision POC", layout="wide")
st.title("🚪 Door Vision Analysis POC")

uploaded_files = st.file_uploader(
    "Upload 3 to 5 door images (JPEG/PNG)", 
    type=["jpg", "jpeg", "png"], 
    accept_multiple_files=True
)

if uploaded_files:
    cols = st.columns(len(uploaded_files))
    for i, file in enumerate(uploaded_files):
        cols[i].image(file, caption=f"Photo #{i+1}", use_container_width=True)

    if st.button("Analyze Doors", type="primary"):
        if not (3 <= len(uploaded_files) <= 5):
            st.error(f"Please upload between 3 and 5 images (currently selected: {len(uploaded_files)}).")
        else:
            with st.spinner("Analyzing hardware, locks, and materials via local vision model..."):
                files_payload = [
                    ("files", (f.name, f.getvalue(), f.type)) for f in uploaded_files
                ]
                try:
                    res = requests.post("http://127.0.0.1:8000/api/analyze-door", files=files_payload)
                    if res.status_code == 200:
                        st.success("Analysis Complete!")
                        st.json(res.json())
                    else:
                        st.error(f"API Error ({res.status_code}): {res.text}")
                except Exception as e:
                    st.error(f"Could not connect to FastAPI backend: {e}")