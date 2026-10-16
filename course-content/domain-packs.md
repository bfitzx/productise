---
title: "Domain packs"
subtitle: "Run the course with data from your own industry"
---

# Domain packs

Every lesson uses one **default running example**: a support-ticket service with tickets, customer accounts, messages and resolutions. It's simple, everyone understands it, and it needs no regulated data.

Learners from a specialised industry get more out of the course by **swapping in their own domain**. Each pack below shows:

- how your domain's entities map onto the running example
- public datasets you can use in each phase
- the compliance topics for week 20
- capstone ideas

**Rule for every pack:** use public or synthetic data only. Never put real personal, patient or customer data into course projects, LLM prompts or public repos.

---

## Pharma and life sciences

**Entity mapping**

| Running example | Pharma equivalent |
|---|---|
| ticket | adverse-event report, or a medical-information enquiry |
| account | product (drug), or a trial sponsor |
| status | case seriousness / outcome / processing status |
| plan changes (SCD2) | label versions, formulation or manufacturer changes |
| help-centre articles (RAG) | drug labels (SPL), prescribing information, SOPs |

**Public data by phase**

| Weeks | Use |
|---|---|
| 2–3 (CLI) | `curl` + `jq` against the **openFDA** APIs (`api.fda.gov/drug/event.json`, `/drug/label.json`) and the **ClinicalTrials.gov API v2** |
| 5–8 (API) | Build a service over your own curated subset: products, events, enquiries |
| 12–15 (data) | **FAERS** quarterly extracts (adverse events) → medallion pipeline. Dimensions: drug, reaction (MedDRA preferred terms), reporter type, country. SCD2 on product labels using **DailyMed** label versions |
| 16–19 (AI) | RAG over openFDA or DailyMed **drug labels** with citations; structured extraction of drug, dose, reaction and seriousness from synthetic case narratives; an agent over ClinicalTrials.gov |
| 21–22 (stats) | Disproportionality analysis (PRR / ROR) on FAERS, and why reporting bias makes FAERS hypothesis-generating rather than proof (selection bias and confounding in practice) |

**Week 20 compliance:**

- GxP and computer system validation
- 21 CFR Part 11 and EU Annex 11 (audit trails, e-signatures)
- pharmacovigilance timelines
- GDPR for trial-participant data
- when an AI feature becomes "validated software"

**Capstone ideas**

- Drug-label comparison and Q&A tool with change tracking across label versions
- Adverse-event signal explorer: pipeline, PRR/ROR, LLM-drafted signal summaries with a human reviewer in the loop
- Clinical-trial landscape explorer: sponsor, site and indication analytics plus cited protocol Q&A
- Medical-information enquiry triage: classify, draft a response from approved content, escalate off-label questions

---

## Healthcare

**Entity mapping:** ticket → encounter or referral · account → provider/practice · status → referral status · plan changes → provider network or system changes · help-centre articles → clinical guidelines or practice policies.

**Public data**

- **Synthea:** synthetic patients and EHR records (FHIR/CSV); use it for weeks 12–15
- **CMS public datasets:** provider directories, quality measures
- **FHIR sandbox servers** for API weeks
- MIMIC needs credentialed access; only use it if you have that access

**Week 20 compliance:** HIPAA (PHI, minimum necessary, BAAs, audit logs, breach notification), GDPR special-category data, and national health-data rules.

**Capstone ideas:** a referral-tracking co-pilot, appointment no-show prediction with outreach, or guideline Q&A with citations.

---

## Fintech and payments

**Entity mapping:** ticket → transaction or dispute · account → customer account or merchant · status → dispute or fraud-review status · plan changes → risk tier or KYC level changes · help-centre articles → policy and regulatory docs.

**Public data**

- **PaySim** (synthetic mobile-money transactions)
- the public credit-card fraud dataset (Kaggle)
- **SEC EDGAR** filings for RAG
- open banking sandbox APIs

**Week 20 compliance:** PCI DSS scope reduction, KYC/AML data handling, SOX controls, and model risk management for AI decisions.

**Capstone ideas:** dispute triage with evidence summarisation, a fraud-alert review queue with LLM explanations, or a filings Q&A tool.

---

## E-commerce and marketplaces

**Entity mapping:** ticket → order or return · account → customer or seller · status → order/return status · plan changes → seller tier changes · help-centre articles → returns and shipping policies.

**Public data**

- the **Olist Brazilian e-commerce** dataset (orders, reviews, sellers)
- **Instacart** basket data
- Amazon review datasets

**Week 20 compliance:** GDPR/consumer law, PCI scope when taking payments, accessibility law (European Accessibility Act).

**Capstone ideas:** a returns-reason analyser, a review-insight dashboard with LLM theme extraction, or a seller-support co-pilot.

---

## Bring any other domain

Answer these five questions in week 3, then map your answers onto the running example:

1. What's the core **event** (your "ticket")?
2. What's the main **entity** that changes over time (your "account" with SCD2)?
3. What **documents** would an assistant need to answer questions from (your RAG corpus)?
4. What **regulation** governs the data?
5. Where can you get **public or synthetic** data?
