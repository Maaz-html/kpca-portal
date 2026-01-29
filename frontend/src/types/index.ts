export interface Client {
    id?: string;
    client_code?: string;
    client_name: string;
    group_name?: string;
    industry?: string;
    relationship_partner?: string;
    primary_contact_name?: string;
    primary_contact_email?: string;
    status: string;
    created_at?: string;
}

export interface Proposal {
    proposal_id?: number;
    client_code: string;
    service_line?: string;
    scope_summary?: string;
    estimated_fees: number;
    issued_date?: string;
    status: string;
    outcome_reason?: string;
    created_at?: string;
    created_by?: string;
}

export interface Assignment {
    assignment_code: string;
    client_code: string;
    proposal_id?: number;
    title: string;
    service_line?: string;
    start_date?: string;
    end_date?: string;
    partner_lead?: string;
    director?: string;
    manager?: string;
    contracted_fee: number;
    status: string;
    created_at?: string;
    created_by?: string;
}

export interface Invoice {
    invoice_no: string;
    assignment_code: string;
    invoice_date: string;
    amount_before_tax: number;
    gst_pct: number;
    amount_with_tax: number;
    due_date?: string;
    status: string;
    created_at?: string;
    created_by?: string;
}

export interface Receipt {
    receipt_id?: number;
    invoice_no: string;
    amount_received: number;
    tds_amount: number;
    receipt_date: string;
    mode: string;
    created_at?: string;
    created_by?: string;
}
