import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# Function to create a requests session with retries
def requests_session_with_retries(retries=3, backoff_factor=0.3):
    session = requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=(500, 502, 504)
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

# Function to scrape data for San Andreas strawberry type
def get_san_andreas_info():
    session = requests_session_with_retries()
    
    url = "https://niewczas.co/en/offer/san-andreas#:~:text=Symmetrically%20conical%2C%20oblong.,of%20great%20smell%20and%20taste."
    
    description = purpose = size_shape = taste_profile = ""

    try:
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extracting variety description
        description_element = soup.find('h1', class_='entry-title')
        if description_element:
            description = description_element.get_text(strip=True)
        
        # Extracting purpose
        purpose_element = soup.find('div', class_='wpb_text_column wpb_content_element').find_next('div', class_='wpb_wrapper').find_all('p')[0]
        if purpose_element:
            purpose = purpose_element.get_text(strip=True)
        
        # Extracting size and shape
        size_shape_element = soup.find('div', class_='wpb_text_column wpb_content_element').find_next('div', class_='wpb_wrapper').find_all('p')[1]
        if size_shape_element:
            size_shape = size_shape_element.get_text(strip=True)

        # Extracting taste profile and firmness
        taste_profile_element = soup.find('div', class_='wpb_text_column wpb_content_element').find_next('div', class_='wpb_wrapper').find_all('p')[2]
        if taste_profile_element:
            taste_profile = taste_profile_element.get_text(strip=True)

    except Exception as e:
        print(f"Failed to retrieve data from {url}: {e}")

    return {
        "Strawberry Type": "San Andreas",
        "Description": description,
        "Purpose": purpose,
        "Size and Shape": size_shape,
        "Taste Profile": taste_profile
    }

# Gather information for San Andreas strawberry
san_andreas_info = get_san_andreas_info()

# Create a DataFrame and save to an Excel file
df = pd.DataFrame([san_andreas_info])
df.to_excel('san_andreas_strawberry_info.xlsx', index=False)

print("Data has been saved to san_andreas_strawberry_info.xlsx")
