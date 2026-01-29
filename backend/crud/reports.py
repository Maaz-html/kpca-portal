from supabase import Client
from datetime import datetime, timedelta

def get_billing_summary(db: Client):
    # Total Billed
    invoices = db.table("invoices").select("amount_with_tax").execute()
    total_billed = sum(i["amount_with_tax"] for i in invoices.data)
    
    # Total Collected
    receipts = db.table("receipts").select("amount_received, tds_amount").execute()
    total_collected = sum(r["amount_received"] + r["tds_amount"] for r in receipts.data)
    
    return {
        "total_billed": total_billed,
        "total_collected": total_collected,
        "outstanding": total_billed - total_collected
    }

def get_ar_aging(db: Client):
    # Simplified aging logic
    invoices = db.table("invoices").select("*").eq("status", "Issued").execute()
    today = datetime.now().date()
    
    aging = {
        "0-30": 0,
        "31-60": 0,
        "61-90": 0,
        "90+": 0
    }
    
    for inv in invoices.data:
        issued_date = datetime.strptime(inv["invoice_date"], "%Y-%m-%d").date()
        days_diff = (today - issued_date).days
        
        amt = inv["amount_with_tax"]
        if days_diff <= 30: aging["0-30"] += amt
        elif days_diff <= 60: aging["31-60"] += amt
        elif days_diff <= 90: aging["61-90"] += amt
        else: aging["90+"] += amt
        
    return aging

def get_proposal_stats(db: Client):
    proposals = db.table("proposals").select("status").execute()
    stats = {}
    for p in proposals.data:
        status = p["status"]
        stats[status] = stats.get(status, 0) + 1
    return stats
