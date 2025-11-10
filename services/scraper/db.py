from pymongo import MongoClient
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "marketplace_db"

app_client = MongoClient(MONGO_URI)
db = app_client[DB_NAME]

def get_company_by_name(name):
    return db.companies.find_one({"name": name})


def save_summary(company_name, summary):
    db.summaries.update_one(
        {"company_name": company_name},
        {"$set": {"summary": summary}, 
        "$setOnInsert": {"created_at": datetime.now()}},
        upsert=True
    )

def get_summary(company_name):
    record = db.summaries.find_one({"company_name": company_name})
    return record["summary"] if record else None


def update_summary(company_name, summary):
    db.summaries.update_one(
        {"company_name": company_name},
        {"$set": {"summary": summary, "updated_at": datetime.now()}}
    )
