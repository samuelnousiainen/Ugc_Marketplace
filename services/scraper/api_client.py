import requests


API_URL = "http://localhost:4000/api"


def get_company_website(company_id):
    try:
        response = requests.get(f"{API_URL}/companywebsite/{company_id}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching company website URL: {e}")
        return {"error": str(e)}
