import pandas as pd
from io import BytesIO
from typing import List, Any, Dict
from pydantic import ValidationError
from schemas.client import ClientCreate
from schemas.assignment import AssignmentCreate

def parse_upload_file(file_content: bytes, filename: str) -> List[Dict[str, Any]]:
    if filename.endswith('.csv'):
        df = pd.read_csv(BytesIO(file_content))
    elif filename.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(BytesIO(file_content))
    else:
        raise ValueError("Unsupported file format. Please upload a CSV or Excel file.")
    
    # Replace NaN with None for Pydantic validation
    return df.where(pd.notnull(df), None).to_dict(orient='records')

def validate_clients(data: List[Dict[str, Any]]) -> List[ClientCreate]:
    validated_clients = []
    errors = []
    
    for index, row in enumerate(data):
        try:
            # Map common variations if needed (e.g. 'Name' to 'client_name')
            # For simplicity, we expect headers to match schema keys
            client = ClientCreate(**row)
            validated_clients.append(client)
        except ValidationError as e:
            errors.append(f"Row {index + 1}: {str(e)}")
            
    if errors:
        raise ValueError("\n".join(errors))
        
    return validated_clients
