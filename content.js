/* ============================================================================
   AI-103 STUDY APP — CONTENT  (window.CONTENT)   *** GENERATED FILE ***
   ----------------------------------------------------------------------------
   Do NOT edit by hand. Regenerate with:  node scripts/build_content.js
   Sources: output/question_bank/bank_master.md, output/flashcards/deck_*.md,
            output/study_guides/section_*.md
   ========================================================================== */

window.CONTENT = {
  "questions": [
    {
      "id": "Q0001",
      "type": "single",
      "domain": "D1",
      "objective": "1.12",
      "difficulty": "med",
      "status": "verified",
      "stem": "VectorAI runs an Azure AI Search instance called BeaconSearch that multiple client apps call. You need to ensure each app can perform only a specific subset of search operations. What should you implement?",
      "why": "RBAC scopes *which operations* each app may perform; endpoints/auth alone don't limit operations.",
      "trap": "B (managed identity) handles *who you are*, not *what you may do* — it doesn't scope operations.",
      "options": [
        {
          "key": "A",
          "text": "Create a private endpoint",
          "correct": false
        },
        {
          "key": "B",
          "text": "Enable Entra ID auth and use managed identities",
          "correct": false
        },
        {
          "key": "C",
          "text": "Assign Azure RBAC permissions to each application",
          "correct": true
        },
        {
          "key": "D",
          "text": "Rotate the admin keys regularly",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0002",
      "type": "single",
      "domain": "D5",
      "objective": "5.2",
      "difficulty": "easy",
      "status": "verified",
      "stem": "You are building an Azure AI Search index with a field `last_updated`. The field's value must be returned with search results. Which attribute must be set on the field?",
      "why": "`retrievable` controls whether a field's value is included in the response, independent of search/filter/sort.",
      "trap": "",
      "options": [
        {
          "key": "A",
          "text": "searchable",
          "correct": false
        },
        {
          "key": "B",
          "text": "retrievable",
          "correct": true
        },
        {
          "key": "C",
          "text": "sortable",
          "correct": false
        },
        {
          "key": "D",
          "text": "filterable",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0003",
      "type": "single",
      "domain": "D5",
      "objective": "5.6",
      "difficulty": "easy",
      "status": "verified",
      "stem": "A firm has ~6,500 scanned invoice images and needs to extract line items, totals, and customer information. Which service should you use?",
      "why": "Document Intelligence has a prebuilt invoice model for structured field/table extraction; Vision only does general image analysis.",
      "trap": "A (Vision) reads text but won't return structured invoice fields like line items/totals.",
      "options": [
        {
          "key": "A",
          "text": "Azure AI Vision",
          "correct": false
        },
        {
          "key": "B",
          "text": "Azure AI Search",
          "correct": false
        },
        {
          "key": "C",
          "text": "Azure AI Document Intelligence",
          "correct": true
        },
        {
          "key": "D",
          "text": "Custom Vision",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0004",
      "type": "multi",
      "domain": "D4",
      "objective": "4.1",
      "difficulty": "med",
      "status": "verified",
      "stem": "Which two kinds of recognition does the entity extraction capability support? (Choose 2)",
      "why": "NER classifies entities in text; entity linking disambiguates them against a knowledge base.",
      "trap": "",
      "options": [
        {
          "key": "A",
          "text": "Entity normalization",
          "correct": false
        },
        {
          "key": "B",
          "text": "Named entity recognition",
          "correct": true
        },
        {
          "key": "C",
          "text": "Entity linking",
          "correct": true
        },
        {
          "key": "D",
          "text": "Entity resolution",
          "correct": false
        },
        {
          "key": "E",
          "text": "Entity relationships",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0005",
      "type": "single",
      "domain": "D1",
      "objective": "1.12",
      "difficulty": "med",
      "status": "verify",
      "stem": "You are building a Python app on Azure AI Foundry that calls a deployed model. Company policy forbids storing keys in code or config. You need service-to-service authentication with the least administrative effort. What should you use?",
      "why": "Managed identity is keyless and needs no secret rotation.",
      "trap": "A still stores a secret (the key) — more admin, and it's still a key, violating \"no keys.\"",
      "options": [
        {
          "key": "A",
          "text": "Store the API key in Azure Key Vault and read it at runtime",
          "correct": false
        },
        {
          "key": "B",
          "text": "Use a system-assigned managed identity with Entra ID",
          "correct": true
        },
        {
          "key": "C",
          "text": "Embed the endpoint key as an environment variable",
          "correct": false
        },
        {
          "key": "D",
          "text": "Use a shared access signature (SAS) token",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0006",
      "type": "single",
      "domain": "D2",
      "objective": "2.2",
      "difficulty": "med",
      "status": "verified",
      "stem": "You must ground an LLM app on 50,000 internal PDFs so answers cite source passages, using both keyword and vector retrieval. Which service provides the retrieval index?",
      "why": "Azure AI Search supports hybrid (keyword + vector + semantic) retrieval — the standard RAG grounding store on Azure.",
      "trap": "",
      "options": [
        {
          "key": "A",
          "text": "Azure Cosmos DB",
          "correct": false
        },
        {
          "key": "B",
          "text": "Azure AI Search",
          "correct": true
        },
        {
          "key": "C",
          "text": "Azure Blob Storage",
          "correct": false
        },
        {
          "key": "D",
          "text": "Azure Cache for Redis",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0007",
      "type": "single",
      "domain": "D3",
      "objective": "3.15",
      "difficulty": "hard",
      "status": "verify",
      "stem": "Your agent accepts user-uploaded images. You must block images containing embedded instructions that try to hijack the model (indirect prompt injection) and classify unsafe visual content. What should you configure?",
      "why": "Content Safety provides content filters plus prompt-injection (jailbreak) detection — maps to the \"responsible AI for multimodal content\" objective.",
      "trap": "",
      "options": [
        {
          "key": "A",
          "text": "A Custom Vision classifier",
          "correct": false
        },
        {
          "key": "B",
          "text": "Azure AI Content Safety filters (with prompt-injection / jailbreak detection)",
          "correct": true
        },
        {
          "key": "C",
          "text": "An Azure AI Search skillset",
          "correct": false
        },
        {
          "key": "D",
          "text": "A managed identity role assignment",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0008",
      "type": "single",
      "domain": "D2",
      "objective": "2.9",
      "difficulty": "med",
      "status": "verified",
      "stem": "You are building a Foundry agent that must call an internal REST API, look up records in a knowledge store, and run a custom Python function. Which agent capability lets the model invoke these at runtime?",
      "why": "Agents invoke external actions via tool/function calling with tool schemas — a core AI-103 agent objective.",
      "trap": "",
      "options": [
        {
          "key": "A",
          "text": "Prompt flow variants",
          "correct": false
        },
        {
          "key": "B",
          "text": "Tool / function calling with defined tool schemas",
          "correct": true
        },
        {
          "key": "C",
          "text": "The semantic ranker",
          "correct": false
        },
        {
          "key": "D",
          "text": "A Content Understanding analyzer",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0009",
      "type": "yesno-series",
      "domain": "D2",
      "objective": "2.1",
      "difficulty": "med",
      "status": "verify",
      "stem": "*Goal:* deploy a GPT-family chat model in Azure AI Foundry so a Python app can call it via an endpoint. *Proposed solution:* create a Foundry project, deploy the model as a standard/serverless endpoint, and connect the app using the Foundry SDK. **Does this meet the goal?**",
      "why": "Deploying to an endpoint and connecting via the Foundry SDK is the standard path.",
      "trap": "In the exam this comes in a set of 2–3 near-identical siblings (e.g. one swaps in \"assign a Reader role\" or \"use Document Intelligence\" → answer No). Remember: you can't go back once you advance.",
      "options": [
        {
          "key": "A",
          "text": "Yes",
          "correct": true
        },
        {
          "key": "B",
          "text": "No",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0010",
      "type": "order",
      "domain": "D2",
      "objective": "2.2",
      "difficulty": "med",
      "status": "verified",
      "stem": "Put the steps to add RAG to an app in the correct order:",
      "why": "Create the index, populate it with embeddings, retrieve at query time, then generate.",
      "trap": "Inverting 1 and 2 (embedding before an index exists) is the tempting wrong sequence.",
      "items": [
        {
          "id": 1,
          "text": "Chunk and embed the source documents"
        },
        {
          "id": 2,
          "text": "Create an Azure AI Search index"
        },
        {
          "id": 3,
          "text": "Retrieve the top-k passages for the user query"
        },
        {
          "id": 4,
          "text": "Pass retrieved context + the query to the LLM"
        }
      ],
      "correctOrder": [
        2,
        1,
        3,
        4
      ]
    },
    {
      "id": "Q0011",
      "type": "multi",
      "domain": "D4",
      "objective": "4.6",
      "difficulty": "easy",
      "status": "verified",
      "stem": "Your agent must accept spoken input and reply with a synthesized voice, including a brand-specific pronunciation. Which two capabilities do you use? (Choose 2)",
      "why": "STT converts the user's audio; TTS with a custom voice produces the branded spoken reply.",
      "trap": "",
      "options": [
        {
          "key": "A",
          "text": "Azure AI Translator",
          "correct": false
        },
        {
          "key": "B",
          "text": "Speech-to-text",
          "correct": true
        },
        {
          "key": "C",
          "text": "Text-to-speech (with custom neural voice)",
          "correct": true
        },
        {
          "key": "D",
          "text": "Document Intelligence",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0012",
      "type": "single",
      "domain": "D2",
      "objective": "2.15",
      "difficulty": "med",
      "status": "verified",
      "stem": "After deploying an agent you must track token usage, latency breakdowns, and safety signals per request. What should you implement?",
      "why": "Maps directly to the \"observability … tracing, token analytics, safety signals, latency breakdowns\" objective.",
      "trap": "",
      "options": [
        {
          "key": "A",
          "text": "Autoscale rules on the endpoint",
          "correct": false
        },
        {
          "key": "B",
          "text": "A private endpoint",
          "correct": false
        },
        {
          "key": "C",
          "text": "Tracing / observability instrumentation (token analytics, latency, safety signals)",
          "correct": true
        },
        {
          "key": "D",
          "text": "A new managed identity",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0013",
      "type": "single",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "med",
      "status": "verified",
      "stem": "You are designing an Azure AI solution that needs geo-redundant failover for its storage while keeping all data inside the same geography for compliance. Which concept provides this, and who defines it?",
      "why": "Region pairs are Microsoft-defined links between two regions in the same geography — they enable geo-redundant replication (e.g., storage GRS) and staged updates while keeping data in-geo.",
      "trap": "C — customers cannot choose or change pairings. Availability zones live *inside one region*, so they don't give cross-region geo-redundancy.",
      "options": [
        {
          "key": "A",
          "text": "Availability zones, defined by the customer",
          "correct": false
        },
        {
          "key": "B",
          "text": "Region pairs, defined by Microsoft",
          "correct": true
        },
        {
          "key": "C",
          "text": "Region pairs, defined by the customer",
          "correct": false
        },
        {
          "key": "D",
          "text": "Availability zones, defined by Microsoft",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0014",
      "type": "single",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "med",
      "status": "verified",
      "stem": "Your Foundry-hosted app must stay available if a single datacenter in its region loses power. What is the most appropriate design?",
      "why": "Availability zones are physically separate locations (independent power, cooling, networking) within one region; spreading the workload across them survives a single-datacenter/zone failure.",
      "trap": "A — region pairs protect against a *whole-region* outage, which is more than this scenario needs. The failure described is intra-region.",
      "options": [
        {
          "key": "A",
          "text": "Deploy across two region pairs",
          "correct": false
        },
        {
          "key": "B",
          "text": "Distribute the workload across availability zones in the region",
          "correct": true
        },
        {
          "key": "C",
          "text": "Enable a private endpoint",
          "correct": false
        },
        {
          "key": "D",
          "text": "Switch to a global service",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0015",
      "type": "single",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "easy",
      "status": "verified",
      "stem": "You plan to deploy a specific Azure OpenAI model, but it is not offered in your preferred region. What is the reason and correct action?",
      "why": "Not all Azure services/models are available in every region — especially newer ones. Verify regional availability and deploy in a region that offers the model.",
      "trap": "A — model deployments are regional, not global. This is the most AI-relevant fact in the section.",
      "options": [
        {
          "key": "A",
          "text": "Models are global — deploy anywhere, no action needed",
          "correct": false
        },
        {
          "key": "B",
          "text": "Service/model availability varies by region; check where the model is available and deploy there",
          "correct": true
        },
        {
          "key": "C",
          "text": "You must enable availability zones first",
          "correct": false
        },
        {
          "key": "D",
          "text": "You must manually create a region pair",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0016",
      "type": "multi",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "med",
      "status": "verified",
      "stem": "Which statements about Azure region pairs are true? (Choose three)",
      "why": "Region pairs share a geography, get staged (never simultaneous) updates, and support geo-redundant replication for some services. Pairings are Microsoft-defined.",
      "trap": "A and E are the classic distractors — updates are *never* simultaneous, and customers can't set pairings.",
      "options": [
        {
          "key": "A",
          "text": "Platform updates are rolled out to both paired regions simultaneously",
          "correct": false
        },
        {
          "key": "B",
          "text": "The two regions reside in the same geography",
          "correct": true
        },
        {
          "key": "C",
          "text": "Platform updates are staged one region at a time",
          "correct": true
        },
        {
          "key": "D",
          "text": "Some services (e.g., storage GRS) can auto-replicate between them",
          "correct": true
        },
        {
          "key": "E",
          "text": "Customers choose which regions are paired",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0017",
      "type": "single",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "med",
      "status": "verified",
      "stem": "A European customer must ensure their AI application's data never leaves the EU for GDPR compliance. Which design choice most directly enforces this?",
      "why": "Region/geography selection controls data residency; region pairs keep any replicated data within the same geographic boundary.",
      "trap": "D — RBAC controls *who can access* data, not *where it physically resides*. A global endpoint doesn't guarantee in-geo storage.",
      "options": [
        {
          "key": "A",
          "text": "Enable availability zones",
          "correct": false
        },
        {
          "key": "B",
          "text": "Select a region within the required geography and rely on in-geo region pairing",
          "correct": true
        },
        {
          "key": "C",
          "text": "Use a global service endpoint",
          "correct": false
        },
        {
          "key": "D",
          "text": "Assign RBAC roles to the data store",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0018",
      "type": "single",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "easy",
      "status": "verified",
      "stem": "What is the standard minimum number of availability zones in a larger Azure region?",
      "why": "The standard for larger regions is a minimum of three physically separate availability zones.",
      "trap": "Newer or smaller regions may have fewer zones — or none yet — so \"always 3\" is not universally true, but 3 is the standard for larger regions.",
      "options": [
        {
          "key": "A",
          "text": "1",
          "correct": false
        },
        {
          "key": "B",
          "text": "2",
          "correct": false
        },
        {
          "key": "C",
          "text": "3",
          "correct": true
        },
        {
          "key": "D",
          "text": "5",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0019",
      "type": "order",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "easy",
      "status": "verified",
      "stem": "Put the Azure resource hierarchy containers in order from the top (broadest) to the bottom (where resources live):",
      "why": "Management group (top) → subscription → resource group → resource (bottom). A resource lives inside all four.",
      "trap": "Swapping subscription and resource group is the common error — the subscription is the billing/isolation boundary *above* resource groups.",
      "items": [
        {
          "id": 1,
          "text": "Resource group"
        },
        {
          "id": 2,
          "text": "Management group"
        },
        {
          "id": 3,
          "text": "Resource"
        },
        {
          "id": 4,
          "text": "Subscription"
        }
      ],
      "correctOrder": [
        2,
        4,
        1,
        3
      ]
    },
    {
      "id": "Q0020",
      "type": "single",
      "domain": "D1",
      "objective": "1.12",
      "difficulty": "med",
      "status": "verified",
      "stem": "A team needs access to every Azure AI resource across all resource groups in one subscription. You want the least administrative effort. Where should you assign the RBAC role?",
      "why": "RBAC assigned at a level inherits down to everything beneath it. Assigning at the subscription reaches all its resource groups and resources in one assignment.",
      "trap": "D (root management group) would also grant it, but far too broadly — it would leak access to *every* subscription in the tenant, not just this one.",
      "options": [
        {
          "key": "A",
          "text": "On each resource individually",
          "correct": false
        },
        {
          "key": "B",
          "text": "On each resource group",
          "correct": false
        },
        {
          "key": "C",
          "text": "At the subscription scope, so it inherits down",
          "correct": true
        },
        {
          "key": "D",
          "text": "On the root management group",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0021",
      "type": "single",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "med",
      "status": "verified",
      "stem": "An AI application uses ~40 Azure resources (a Foundry project, storage, search, networking) that are created and torn down together. You want to delete the whole environment in one action. What is the best design?",
      "why": "Best practice is to group resources that share a lifecycle in one resource group; deleting the resource group cascades and removes everything inside it.",
      "trap": "A and D make teardown harder, not easier — the whole point of a resource group is the single cascading delete.",
      "options": [
        {
          "key": "A",
          "text": "Put each resource in its own resource group",
          "correct": false
        },
        {
          "key": "B",
          "text": "Put all same-lifecycle resources in one resource group, then delete the group",
          "correct": true
        },
        {
          "key": "C",
          "text": "Put the resources in separate subscriptions",
          "correct": false
        },
        {
          "key": "D",
          "text": "Delete each resource manually in order",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0022",
      "type": "single",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "med",
      "status": "verified",
      "stem": "Which statement about Azure resource groups is TRUE?",
      "why": "A resource group can span regions (a VM in East US and one in West US) but is tied to exactly one subscription; every resource belongs to exactly one resource group.",
      "trap": "A — resource groups never span subscriptions, because the resource group is tied to a single subscription.",
      "options": [
        {
          "key": "A",
          "text": "A resource group can contain resources from multiple subscriptions",
          "correct": false
        },
        {
          "key": "B",
          "text": "A resource group can contain resources from multiple regions but only one subscription",
          "correct": true
        },
        {
          "key": "C",
          "text": "A resource can belong to two resource groups at once",
          "correct": false
        },
        {
          "key": "D",
          "text": "A resource can exist without any resource group",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0023",
      "type": "single",
      "domain": "D1",
      "objective": "1.9",
      "difficulty": "med",
      "status": "verified",
      "stem": "You must enforce a hard monthly spending cap of $200 for a project's Azure usage. At which level of the hierarchy is this budget/quota applied?",
      "why": "Subscriptions are the billing boundary and carry quotas, limits, and budgets (including spend caps).",
      "trap": "A/C — budgets are managed at the subscription (billing) level, not per resource or resource group.",
      "options": [
        {
          "key": "A",
          "text": "Resource group",
          "correct": false
        },
        {
          "key": "B",
          "text": "Subscription",
          "correct": true
        },
        {
          "key": "C",
          "text": "Individual resource",
          "correct": false
        },
        {
          "key": "D",
          "text": "Management group",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0024",
      "type": "single",
      "domain": "D1",
      "objective": "1.12",
      "difficulty": "med",
      "status": "verified",
      "stem": "You want two workloads to be network-isolated from each other by default, with no connectivity between them unless you explicitly add it. Which design gives you this isolation with the least configuration?",
      "why": "By default resources in two different subscriptions cannot talk to each other — subscriptions provide isolation out of the box.",
      "trap": "C — resource groups are logical/organizational containers; they do not create network isolation by themselves.",
      "options": [
        {
          "key": "A",
          "text": "Place them in the same resource group",
          "correct": false
        },
        {
          "key": "B",
          "text": "Place them in separate subscriptions",
          "correct": true
        },
        {
          "key": "C",
          "text": "Place them in the same subscription, different resource groups",
          "correct": false
        },
        {
          "key": "D",
          "text": "Assign different RBAC roles to each",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0025",
      "type": "multi",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "med",
      "status": "verified",
      "stem": "Which statements about Azure resource groups are true? (Choose three)",
      "why": "Resource groups cascade-delete their contents, require exactly one per resource, and can hold resources from multiple regions — but only within a single subscription.",
      "trap": "D and E are the classic false statements — a resource group is tied to one subscription, and no resource can exist outside a resource group.",
      "options": [
        {
          "key": "A",
          "text": "Deleting a resource group deletes all resources inside it",
          "correct": true
        },
        {
          "key": "B",
          "text": "Every Azure resource must belong to exactly one resource group",
          "correct": true
        },
        {
          "key": "C",
          "text": "A resource group can span multiple regions",
          "correct": true
        },
        {
          "key": "D",
          "text": "A resource group can span multiple subscriptions",
          "correct": false
        },
        {
          "key": "E",
          "text": "A resource can exist without a resource group",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0026",
      "type": "single",
      "domain": "D1",
      "objective": "1.12",
      "difficulty": "med",
      "status": "verified",
      "stem": "Company rules require that no Azure resources may be deployed outside the West Europe region. Which service enforces this preventively?",
      "why": "Azure Policy enforces preventive rules about *what/how* can be deployed (e.g., allowed regions). It inherits down the hierarchy like RBAC does.",
      "trap": "A — RBAC controls *who* can act, not *what/where* they may deploy. It can't restrict allowed regions.",
      "options": [
        {
          "key": "A",
          "text": "Azure RBAC",
          "correct": false
        },
        {
          "key": "B",
          "text": "Azure Policy",
          "correct": true
        },
        {
          "key": "C",
          "text": "A resource lock",
          "correct": false
        },
        {
          "key": "D",
          "text": "A managed identity",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0027",
      "type": "single",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "easy",
      "status": "verified",
      "stem": "How many root management groups does a single Azure tenant have?",
      "why": "Every Azure tenant has exactly one root management group — the single top-level container for all resources.",
      "trap": "D confuses the total management-group limit (10,000 per tenant) with the number of *root* management groups (always one).",
      "options": [
        {
          "key": "A",
          "text": "Zero — you create one if needed",
          "correct": false
        },
        {
          "key": "B",
          "text": "Exactly one",
          "correct": true
        },
        {
          "key": "C",
          "text": "One per subscription",
          "correct": false
        },
        {
          "key": "D",
          "text": "Up to 10,000",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0028",
      "type": "yesno-series",
      "domain": "D1",
      "objective": "1.12",
      "difficulty": "med",
      "status": "verified",
      "stem": "*Goal:* give an administrator access to all resources in every subscription of your tenant with a single role assignment. *Proposed solution:* assign the RBAC role at the **root management group** scope. **Does this meet the goal?**",
      "why": "RBAC assigned at the root management group inherits down to every subscription, resource group, and resource in the tenant.",
      "trap": "In an exam set this comes with siblings — e.g., \"assign it on one subscription\" (→ No, only that subscription) or \"assign it on a resource group\" (→ No, only those resources). Match the scope to the reach.",
      "options": [
        {
          "key": "A",
          "text": "Yes",
          "correct": true
        },
        {
          "key": "B",
          "text": "No",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0029",
      "type": "single",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "med",
      "status": "verified",
      "stem": "Your enterprise wants a Microsoft-recommended, pre-built foundation for organizing a large Azure environment with governance and security by default. Which framework/concept should you follow?",
      "why": "The Cloud Adoption Framework (CAF) is Microsoft's guidance for organizing Azure; a Landing Zone is the pre-built starting environment/operating model it defines for larger customers.",
      "trap": "D — Azure Policy is one enforcement tool, not the overall organizing framework.",
      "options": [
        {
          "key": "A",
          "text": "Azure Well-Architected Review only",
          "correct": false
        },
        {
          "key": "B",
          "text": "The Cloud Adoption Framework, using a Landing Zone as the starting platform",
          "correct": true
        },
        {
          "key": "C",
          "text": "A single resource group for everything",
          "correct": false
        },
        {
          "key": "D",
          "text": "Azure Policy alone",
          "correct": false
        }
      ]
    },
    {
      "id": "Q0030",
      "type": "single",
      "domain": "D1",
      "objective": "1.5",
      "difficulty": "med",
      "status": "verified",
      "stem": "According to Microsoft best practice, how should you organize management groups?",
      "why": "Microsoft recommends organizing by workload function — a platform management group (identity, management, connectivity) plus an applications group (modern/legacy) — though it stresses there's no single perfect design.",
      "trap": "A and B \"work\" and are allowed, but they are explicitly *not* Microsoft's recommended best practice.",
      "options": [
        {
          "key": "A",
          "text": "By geography (one per country)",
          "correct": false
        },
        {
          "key": "B",
          "text": "By department (one per business unit like IT or HR)",
          "correct": false
        },
        {
          "key": "C",
          "text": "By workload function (e.g., a platform group for identity/management/connectivity, an applications group)",
          "correct": true
        },
        {
          "key": "D",
          "text": "Everything under the root management group with no nesting",
          "correct": false
        }
      ]
    }
  ],
  "cards": [
    {
      "id": "C0001",
      "domain": "D1",
      "front": "What is an Azure *region*, and is it a single datacenter?",
      "back": "A geographically distinct location that hosts Azure services. It contains one or more datacenters — never just one — so a single datacenter failure doesn't automatically down the region."
    },
    {
      "id": "C0002",
      "domain": "D1",
      "front": "What is an Azure *region pair* — and who defines it?",
      "back": "Two regions in the same geography, defined by Microsoft (customers cannot change pairings). Benefits: platform updates staged one region at a time, geo-redundant replication for some services (e.g., storage GRS), and data stays within the geography."
    },
    {
      "id": "C0003",
      "domain": "D1",
      "front": "What is an Availability Zone, and how many does a standard (larger) region have?",
      "back": "A physically separate location *within one region*, with independent power, cooling, and networking. Larger regions have a minimum of 3. Spreading a workload across zones survives a single-datacenter/zone failure."
    },
    {
      "id": "C0004",
      "domain": "D1",
      "front": "Regional vs global Azure services — what's the difference for deployment?",
      "back": "Regional services (e.g., virtual machines, load balancers) require you to pick a region. Global services are reachable from any region with no region choice."
    },
    {
      "id": "C0005",
      "domain": "D1",
      "front": "Beyond latency, why does region selection matter for an AI/Foundry deployment?",
      "back": "Two reasons — data residency/compliance (keep data inside a required geography for GDPR/HIPAA/PCI/etc.) and service/model regional availability (newer models/services aren't offered in every region, so verify where a model exists before deploying)."
    },
    {
      "id": "C0006",
      "domain": "D1",
      "front": "List the Azure resource hierarchy from top to bottom.",
      "back": "Management Group → Subscription → Resource Group → Resource. Every resource lives inside all four containers at once."
    },
    {
      "id": "C0007",
      "domain": "D1",
      "front": "How many root management groups does an Azure tenant have, and what is it?",
      "back": "Exactly one per tenant. The root management group is the top-level container for every resource in the tenant — you can't have zero or two."
    },
    {
      "id": "C0008",
      "domain": "D1",
      "front": "Which direction does governance inherit in the Azure hierarchy, and which two things inherit?",
      "back": "Downward. Azure RBAC (role assignments) and Azure Policy (rules) set at a level apply to everything below it. Set at a management group → all subscriptions, resource groups, and resources beneath it; the higher you attach it, the broader it reaches."
    },
    {
      "id": "C0009",
      "domain": "D1",
      "front": "What is an Azure *subscription* — name its main roles.",
      "back": "The billing boundary and an isolation boundary (resources in two subscriptions can't talk by default). Tied to one Entra ID tenant for access control, and it carries quotas, limits, and budgets (e.g., cap spend at $200/month)."
    },
    {
      "id": "C0010",
      "domain": "D1",
      "front": "What is a *resource group*, and its three key rules?",
      "back": "A container for the actual resources. (1) (Nearly) every resource belongs to exactly one resource group — a few resource types deploy at subscription/mgmt-group/tenant scope. (2) It can span regions but NOT subscriptions. (3) Deleting it deletes all resources inside. Best practice: group resources that share the same lifecycle."
    },
    {
      "id": "C0011",
      "domain": "D1",
      "front": "Azure Policy vs Azure RBAC — what does each control?",
      "back": "Azure Policy = *what/how* can be deployed (preventive rules, e.g., \"only allow West Europe\"). Azure RBAC (Role-Based Access Control) = *who* can do *what* (identity-based permissions). Different tools; both inherit down the hierarchy."
    },
    {
      "id": "C0012",
      "domain": "D1",
      "front": "Management group limit per tenant, and Microsoft's best-practice organization?",
      "back": "Up to 10,000 management groups per tenant. Best practice = organize by workload (a *platform* group with identity/management/connectivity; an *applications* group split into modern/legacy) — not by geography or department. Guided by the Cloud Adoption Framework (CAF) and Landing Zones."
    }
  ],
  "guides": [
    {
      "id": "section_01_azure_global_infrastructure",
      "title": "Azure Global Infrastructure (Backbone, Regions, Region Pairs, Availability Zones)",
      "description": "How Azure is physically organized — regions, region pairs, and availability zones — and how that choice drives outage protection, data residency, and which AI models you can even deploy.",
      "objectives": "1.5, 1.12",
      "codes": [
        "1.5",
        "1.12"
      ],
      "source": "input/transcripts/01-Azure_Global_Backbone.md, input/transcripts/02-Azure_Regions_And_Datacenters.md (Udemy AI-103 / Christopher Nett, recorded 2026). Facts cross-checked against general Azure Well-Architected / global-infrastructure documentation.",
      "minutes": 6,
      "sections": [
        {
          "key": "pareto_0",
          "kind": "pareto",
          "label": "Key points",
          "title": "The 20% that matters (Pareto summary)",
          "items": [
            "<strong>Region</strong> = a geographically distinct location containing <strong>one or more datacenters</strong>. It's what you pick when you deploy a resource. A region is <em>not</em> a single datacenter.",
            "<strong>Region pair</strong> = <strong>two</strong> regions in the <strong>same geography</strong>, <strong>defined by Microsoft</strong> (you cannot change them). Benefits: staged updates (one region at a time), geo-redundant replication for some services (e.g., <strong>Geo-Redundant Storage (GRS)</strong> — Azure Storage automatically copying your data to the paired region), and your data stays in-geography.",
            "<strong>Availability Zone (AZ)</strong> = a <strong>physically separate</strong> location <em>within one region</em>, with <strong>independent power, cooling, and networking</strong>. Standard for larger regions = <strong>minimum 3</strong> zones. Protects against a single-datacenter failure.",
            "<strong>Not all services/models are available in every region</strong> — especially newer ones. This is the AI-relevant fact: a specific model in Azure OpenAI or <strong>Azure AI Foundry</strong> (Microsoft's platform for building AI apps and agents) may only exist in certain regions.",
            "<strong>Region choice drives data residency &amp; compliance.</strong> <em>Data residency</em> = where your data physically lives. The rules are things like GDPR (European Union data-privacy law), HIPAA (US health-data privacy law), PCI DSS (payment-card security standard), and SOC 2 / ISO (security-audit certifications). Pick the region/geography that meets the rule."
          ]
        },
        {
          "key": "concepts_1",
          "kind": "concepts",
          "label": "Concepts",
          "title": "Concepts (plain language)",
          "html": "\n<p><strong>The global backbone.</strong> The physical layer under Azure: 60+ regions, 130,000+ miles of fiber plus subsea (undersea) cables, network edge sites, and thousands of peering connections (direct links between Microsoft's network and other networks). Microsoft keeps expanding it. Takeaway for the exam: Azure is globally distributed, and Microsoft brings regions <em>close to users</em> to cut latency (the delay before data arrives).</p>\n<p><strong>Regions.</strong> A region is the deployment target you select (e.g., <em>East US</em>, <em>North Europe</em>). Three things to remember: 1. A region is a set of datacenters, not one building — so a single datacenter failure doesn't automatically take the region down. 2. Service availability <strong>varies by region</strong> (newer/\"exotic\" services land in prominent regions first). 3. Some services are <strong>global</strong> (reachable from anywhere, no region choice) and some are <strong>regional</strong> (you must pick a region — e.g., virtual machines (VMs), which are cloud servers you run).</p>\n<p><strong>Region pairs.</strong> Microsoft links two regions in the same geography (e.g., East US ↔ West US). You don't choose them and can't change them. Why they help:</p>\n<ul>\n<li><strong>Staged updates</strong> — platform updates never hit both paired regions at once.</li>\n<li><strong>Disaster recovery</strong> — if one region fails, the paired region can back up some services.</li>\n<li><strong>Geo-redundant replication</strong> — services like Azure Storage can auto-replicate between the pair.</li>\n<li><strong>Data sovereignty</strong> (the legal requirement that data stays within a country's or region's borders) — replication stays inside the same geographic boundary, so data doesn't cross continents.</li>\n</ul>\n<p><strong>Availability Zones.</strong> Inside a <em>single</em> region, AZs are separate physical locations (AZ1/AZ2/AZ3), each with its own power, cooling, and network, interconnected by low-latency links. A larger region typically has <strong>3</strong>. You spread a workload (VMs, disks, load balancers — which distribute incoming traffic across servers) across zones so a one-datacenter/one-zone outage doesn't take your app down. Some services are <strong>zone-redundant</strong> and replicate across zones automatically.</p>\n<p><strong>Region pair vs Availability Zone — the key distinction the exam leans on:</strong></p>\n<ul>\n<li>AZ protects against a <strong>datacenter</strong> failure <em>within</em> a region.</li>\n<li>Region pair protects against an <strong>entire region</strong> failure <em>across</em> two regions in the same geography.</li>\n</ul>\n<p><strong>The demo (transcript 02).</strong> The Azure <em>regions list</em> shows, per region: AZ support (yes/no), its paired region (if any), physical location (often only the state/country — exact datacenter sites are hidden for security), and its geography. Newer regions (e.g., Austria East) may have AZs but <strong>no pair yet</strong>. The <em>global infrastructure map</em> (a spinning globe) lets you filter regions by compliance (GDPR, HIPAA, PCI DSS, SOC 2/ISO), disaster-recovery/pairing, sustainability, and AZ presence.</p>\n      "
        },
        {
          "key": "diagram_2",
          "kind": "diagram",
          "label": "Diagram",
          "title": "Diagram — Azure infrastructure hierarchy & resiliency",
          "svg": "<svg viewBox=\"0 0 640 484\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Diagram: a geography contains a Microsoft-defined region pair. Each region contains availability zones. Availability zones survive a datacenter failure; the paired region survives a whole-region failure; the geography choice answers data residency.\">\n  <!-- Styling comes from the app stylesheet (.dg-* classes reference the brand\n       tokens); the asset itself carries no raw colors. -->\n\n  <!-- GEOGRAPHY boundary -->\n  <rect class=\"dg-boundary\" x=\"8\" y=\"10\" width=\"624\" height=\"272\" rx=\"12\"/>\n  <text class=\"dg-kicker\" x=\"26\" y=\"36\">GEOGRAPHY</text>\n  <text class=\"dg-note\" x=\"130\" y=\"36\">e.g., United States — compliance and data-residency boundary</text>\n\n  <!-- Region: East US with availability zones -->\n  <rect class=\"dg-box\" x=\"28\" y=\"54\" width=\"276\" height=\"204\" rx=\"10\"/>\n  <text class=\"dg-title\" x=\"46\" y=\"82\">REGION — East US</text>\n  <rect class=\"dg-chip\" x=\"46\" y=\"96\" width=\"240\" height=\"36\" rx=\"8\"/>\n  <text class=\"dg-label\" x=\"60\" y=\"119\">AZ1</text>\n  <text class=\"dg-note\" x=\"100\" y=\"119\">one or more datacenters</text>\n  <rect class=\"dg-chip\" x=\"46\" y=\"140\" width=\"240\" height=\"36\" rx=\"8\"/>\n  <text class=\"dg-label\" x=\"60\" y=\"163\">AZ2</text>\n  <text class=\"dg-note\" x=\"100\" y=\"163\">independent power + cooling</text>\n  <rect class=\"dg-chip\" x=\"46\" y=\"184\" width=\"240\" height=\"36\" rx=\"8\"/>\n  <text class=\"dg-label\" x=\"60\" y=\"207\">AZ3</text>\n  <text class=\"dg-note\" x=\"100\" y=\"207\">independent network</text>\n  <text class=\"dg-note\" x=\"46\" y=\"245\">3+ zones in larger regions</text>\n\n  <!-- Region: West US (the pair) -->\n  <rect class=\"dg-box dg-box-soft\" x=\"336\" y=\"54\" width=\"276\" height=\"204\" rx=\"10\"/>\n  <text class=\"dg-title\" x=\"354\" y=\"82\">REGION — West US</text>\n  <text class=\"dg-note\" x=\"354\" y=\"104\">the pair — you cannot change it</text>\n  <text class=\"dg-note\" x=\"354\" y=\"140\">• staged platform updates</text>\n  <text class=\"dg-note\" x=\"354\" y=\"166\">• geo-redundant replication (GRS)</text>\n  <text class=\"dg-note\" x=\"354\" y=\"192\">• disaster-recovery backup</text>\n  <text class=\"dg-note\" x=\"354\" y=\"218\">• replication stays in-geography</text>\n\n  <!-- Pair link -->\n  <line class=\"dg-pair\" x1=\"304\" y1=\"156\" x2=\"336\" y2=\"156\"/>\n  <path class=\"dg-pairhead\" d=\"M310 150 l-8 6 8 6 z\"/>\n  <path class=\"dg-pairhead\" d=\"M330 150 l8 6 -8 6 z\"/>\n  <text class=\"dg-label\" x=\"320\" y=\"278\" text-anchor=\"middle\">REGION PAIR — defined by Microsoft, same geography</text>\n\n  <!-- Resiliency decision -->\n  <text class=\"dg-kicker\" x=\"8\" y=\"322\">RESILIENCY DECISION</text>\n  <g>\n    <text class=\"dg-note\" x=\"8\" y=\"352\">A single datacenter fails</text>\n    <line class=\"dg-go\" x1=\"238\" y1=\"347\" x2=\"286\" y2=\"347\"/><path class=\"dg-gohead\" d=\"M286 342 l9 5 -9 5 z\"/>\n    <text class=\"dg-answer\" x=\"304\" y=\"352\">Availability Zones (within the region)</text>\n  </g>\n  <g>\n    <text class=\"dg-note\" x=\"8\" y=\"388\">The whole region fails</text>\n    <line class=\"dg-go\" x1=\"238\" y1=\"383\" x2=\"286\" y2=\"383\"/><path class=\"dg-gohead\" d=\"M286 378 l9 5 -9 5 z\"/>\n    <text class=\"dg-answer\" x=\"304\" y=\"388\">Region pair (across regions, same geography)</text>\n  </g>\n  <g>\n    <text class=\"dg-note\" x=\"8\" y=\"424\">Data must stay in-country</text>\n    <line class=\"dg-go\" x1=\"238\" y1=\"419\" x2=\"286\" y2=\"419\"/><path class=\"dg-gohead\" d=\"M286 414 l9 5 -9 5 z\"/>\n    <text class=\"dg-answer\" x=\"304\" y=\"424\">Choose the region / geography (residency)</text>\n  </g>\n  <g>\n    <text class=\"dg-note\" x=\"8\" y=\"460\">Model or service missing</text>\n    <line class=\"dg-go\" x1=\"238\" y1=\"455\" x2=\"286\" y2=\"455\"/><path class=\"dg-gohead\" d=\"M286 450 l9 5 -9 5 z\"/>\n    <text class=\"dg-answer\" x=\"304\" y=\"460\">Deploy where it is offered (regional availability)</text>\n  </g>\n</svg>"
        },
        {
          "key": "memorize_3",
          "kind": "memorize",
          "label": "Memorize",
          "title": "MEMORIZE",
          "items": [
            "Region = geographically distinct location with <strong>one or more</strong> datacenters.",
            "Region pair = 2 regions, <strong>same geography</strong>, <strong>Microsoft-defined</strong> (not customer-changeable); staged updates + geo-redundant replication + in-geo data.",
            "Availability Zone = physically separate location <strong>within a region</strong>, independent power/cooling/network; larger regions have <strong>≥ 3</strong>.",
            "Regional vs global services — regional services (VMs, load balancers) require a region choice; global services don't.",
            "Region choice matters for AI beyond latency: <strong>data residency/compliance</strong> + <strong>service/model regional availability</strong>."
          ],
          "cardIds": [
            "C0001",
            "C0002",
            "C0003",
            "C0004",
            "C0005"
          ]
        },
        {
          "key": "do_4",
          "kind": "do",
          "label": "Lab checklist",
          "title": "DO",
          "items": [
            "Open the Azure regions list / global infrastructure map. Pick the region you'd deploy a Foundry project in and record: AZ support? paired region? geography?",
            "In the Azure portal, check the <strong>regional availability of an Azure OpenAI / Foundry model</strong> — note which regions offer the model you'd want."
          ]
        },
        {
          "key": "gotchas_5",
          "kind": "gotchas",
          "label": "Gotchas",
          "title": "Gotchas & likely exam angles",
          "items": [
            "<strong>\"Who defines region pairs?\"</strong> → Microsoft. Any answer saying the customer configures pairings is wrong.",
            "<strong>AZ vs region pair mix-up</strong> — read whether the failure is a <em>datacenter</em> (→ AZ) or a <em>whole region</em> (→ pair).",
            "<strong>\"Model not available in my region\"</strong> → it's <em>regional availability</em>, not a bug; deploy where the model is offered. (Most AI-relevant hook in this section.)",
            "<strong>Data residency</strong> → solved by <em>region/geography selection</em>, not by <strong>Role-Based Access Control (RBAC)</strong> (which controls <em>who</em> can access a resource) or private endpoints (private network connections to a service).",
            "<strong>A region is not one datacenter</strong> — single-datacenter-as-single-point-of-failure is the wrong mental model."
          ]
        },
        {
          "key": "verify_6",
          "kind": "verify",
          "label": "Verify & gaps",
          "title": "VERIFY / GAPS",
          "html": "\n<ul>\n<li>Nothing unverified — all facts here are well-established Azure fundamentals.</li>\n<li><strong>Coverage:</strong> objective <strong>1.5</strong> is now <em>partial</em>. Still uncovered for 1.5: private networking topology and the <em>Foundry-specific</em> deployment/infra design (comes later, lectures 28–34). Tracked in the coverage map.</li>\n</ul>\n      "
        }
      ],
      "video": "videos/section_01_azure_global_infrastructure.mp4"
    },
    {
      "id": "section_02_azure_resource_hierarchy",
      "title": "Azure Resource Hierarchy & Governance (Management Groups, Subscriptions, Resource Groups, Resources)",
      "description": "How an Azure environment is structured and governed — management groups, subscriptions, resource groups, and resources — and how access and policy rules set at the top flow down to everything beneath.",
      "objectives": "1.5, 1.12, 1.9",
      "codes": [
        "1.5",
        "1.12",
        "1.9"
      ],
      "source": "input/transcripts/03-Azure_Resource_Hierarchy.md (Udemy AI-103 / Christopher Nett, recorded 2026). Load-bearing facts verified live against Microsoft Learn on 2026-07-31:",
      "minutes": 10,
      "sections": [
        {
          "key": "pareto_0",
          "kind": "pareto",
          "label": "Key points",
          "title": "The 20% that matters (Pareto summary)",
          "items": [
            "<strong>Four containers, top to bottom: Management Group → Subscription → Resource Group → Resource.</strong> Every resource lives inside all four. Memorize this order — it's the spine of everything else.",
            "<strong>Root management group</strong> = the single top-level container that <em>every</em> Azure tenant has. Exactly <strong>one</strong> per tenant; you can't have zero or two.",
            "<strong>Inheritance flows DOWN.</strong> Anything you set at a level (Azure <strong>RBAC</strong> role assignments and <strong>Azure Policy</strong> rules) automatically applies to <em>everything below it</em>. Grant access at the root management group → the person can reach every resource in the tenant.",
            "<strong>Subscription</strong> = the <strong>billing boundary</strong> and an <strong>isolation boundary</strong>. It's tied to exactly one <strong>Entra ID</strong> (Microsoft's cloud identity service, formerly Azure Active Directory) tenant, and it's where <strong>quotas, limits, and budgets</strong> live (e.g., \"cap spend at $200/month\").",
            "<strong>Resource group</strong> = a container for resources that <strong>share the same lifecycle</strong>. Deleting the resource group deletes <strong>everything in it</strong> in one action. A resource group can <strong>span regions</strong> but <strong>cannot span subscriptions</strong>.",
            "<strong>Azure Policy vs Azure RBAC:</strong> Policy controls <strong>what can be deployed/how</strong> (preventive rules, e.g., \"no resources outside West Europe\"); RBAC controls <strong>who can do what</strong> (identity-based permissions). Different tools, both inherit down."
          ]
        },
        {
          "key": "concepts_1",
          "kind": "concepts",
          "label": "Concepts",
          "title": "Concepts (plain language)",
          "html": "\n<p><strong>Why a hierarchy at all — \"governance.\"</strong> <em>Governance</em> just means the rules and structure that keep an Azure environment secure, cost-controlled, performant, and available. Azure gives you four nested containers to hang those rules on. Get the structure right and security/cost/compliance settings apply automatically to everything inside.</p>\n<p><strong>Management groups (top).</strong> <em>Management groups</em> are the top-level containers used to organize an entire Azure environment. Every tenant (your company's Azure account boundary) starts with one <strong>root management group</strong> — the top of the tree, exactly one, always present. Below it you can create more management groups and nest them in layers. Their whole point: they <strong>enable inheritance</strong> of access controls (RBAC) and security/compliance settings (Azure Policy) <em>down</em> to everything beneath them. A single tenant can hold up to <strong>10,000 management groups</strong> (a limit almost nobody hits).</p>\n<ul>\n<li><strong>Microsoft's recommended organization = by workload function, not by geography or department.</strong> The best-practice pattern: a <strong>platform</strong> management group holding sub-groups like <strong>identity</strong>, <strong>management</strong>, and <strong>connectivity</strong>; plus an <strong>applications</strong> management group split into <strong>modern apps</strong> (serverless/containerized) and <strong>legacy apps</strong> (traditional virtual machines). You <em>could</em> instead organize by country (US / India) or department (IT / HR) — it works, but it's not what Microsoft recommends.</li>\n<li><strong>But there's no single \"correct\" design.</strong> Microsoft explicitly says to start from their best practice and adapt to your own requirements.</li>\n</ul>\n<p><strong>Subscriptions (second level).</strong> A <em>subscription</em> is the <strong>billing container</strong> — it's what ties resource deployment to how you pay (a credit card for individuals, an Enterprise Agreement for companies). It's more than billing, though:</p>\n<ul>\n<li><strong>Isolation boundary.</strong> By default resources in two different subscriptions <strong>cannot talk to each other</strong> — that's a security benefit you get for free.</li>\n<li><strong>Access-control anchor.</strong> Each subscription is tied to one <strong>Entra ID</strong> tenant, and you can assign RBAC at the subscription level.</li>\n<li><strong>Quotas, limits, and budgets.</strong> You can enforce caps — e.g., a <strong>budget</strong> of \"$200/month max,\" or regional deployment limits.</li>\n<li><strong>Common patterns:</strong> split one app across <strong>dev / test / prod</strong> subscriptions (staging between environments), or give each <strong>business unit</strong> its own subscription (makes cost allocation easy).</li>\n</ul>\n<p><strong>Resource groups (third level).</strong> A <em>resource group</em> is a named container that holds the actual resources. Rules the exam leans on:</p>\n<ul>\n<li>Nearly every resource belongs to <strong>exactly one</strong> resource group. (Strictly, Microsoft Learn notes a <em>few</em> resource types deploy at subscription/management-group/tenant scope and live <em>outside</em> a resource group — the video said \"there is no resource without a resource group,\" which is the common-case rule but not literally universal.)</li>\n<li>A resource group can hold resources <strong>from multiple regions</strong> (a VM in East US and one in West US), but <strong>all within a single subscription</strong> — it <strong>cannot span subscriptions</strong>.</li>\n<li><strong>Deleting the resource group deletes every resource inside it</strong> in one shot — hugely convenient for tearing down an app with 70–80 resources.</li>\n<li><strong>Best practice: group resources that share the same lifecycle.</strong> All the pieces of one app/environment (VMs, networks, load balancers, DNS zones, firewall) go in one resource group, so you can create or delete them together.</li>\n</ul>\n<p><strong>Resources (bottom).</strong> The actual things you deploy: virtual machines, virtual networks, app services, Cosmos DB, load balancers, DNS zones, Azure Firewall — and, for us, <strong>Azure AI Foundry</strong> projects and model deployments. Lowest level of the tree.</p>\n<p><strong>Inheritance + the two governance tools.</strong> You attach governance at any level and it <strong>flows down</strong> to every level beneath:</p>\n<ul>\n<li><strong>Azure RBAC</strong> (Role-Based Access Control) = <em>who</em> can do <em>what</em>. Assign a role at the management group → it applies to all subscriptions, resource groups, and resources under it. Assign it at a subscription → only that subscription's resource groups and resources. Assign at a resource group → only its resources.</li>\n<li><strong>Azure Policy</strong> = preventive rules on <em>what/how</em> things deploy — e.g., \"block deployments to any region except West Europe.\" Also inherits down.</li>\n<li>The higher you attach a rule, the broader it reaches — that's why a good hierarchy makes governance easy.</li>\n</ul>\n<p><strong>Frameworks: Cloud Adoption Framework &amp; Landing Zones.</strong> The <strong>Cloud Adoption Framework (CAF)</strong> is Microsoft's written guidance (hundreds of pages) for organizing an Azure environment with governance and security by default. Within it, a <strong>Landing Zone</strong> is a pre-built starting point + operating model + platform that bigger customers use as their foundation. Exam-relevant only as vocabulary: CAF = the framework, Landing Zone = the ready-made starting environment it describes.</p>\n      "
        },
        {
          "key": "diagram_2",
          "kind": "diagram",
          "label": "Diagram",
          "title": "Diagram — the hierarchy and how governance inherits down",
          "svg": "<svg viewBox=\"0 0 640 560\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Diagram: the Azure resource hierarchy from root management group down to management groups, subscriptions, resource groups, and resources. Role-based access control and Azure Policy attached at any level inherit down to everything beneath it.\">\n  <!-- Styling comes from the app stylesheet (.dg-* classes reference the brand\n       tokens); the asset itself carries no raw colors. -->\n\n  <!-- Inheritance rail -->\n  <text class=\"dg-kicker\" x=\"8\" y=\"30\">RBAC + POLICY</text>\n  <text class=\"dg-note\" x=\"8\" y=\"52\">attach at any level;</text>\n  <text class=\"dg-note\" x=\"8\" y=\"72\">the higher you attach,</text>\n  <text class=\"dg-note\" x=\"8\" y=\"92\">the broader it reaches</text>\n  <line class=\"dg-go\" x1=\"52\" y1=\"112\" x2=\"52\" y2=\"490\"/>\n  <path class=\"dg-gohead\" d=\"M47 490 l5 10 5 -10 z\"/>\n  <text class=\"dg-answer\" x=\"66\" y=\"300\">inherits down</text>\n\n  <!-- Level 1: root management group -->\n  <rect class=\"dg-box dg-box-dark\" x=\"190\" y=\"14\" width=\"300\" height=\"72\" rx=\"10\"/>\n  <text class=\"dg-title-inv\" x=\"212\" y=\"44\">ROOT MANAGEMENT GROUP</text>\n  <text class=\"dg-note-inv\" x=\"212\" y=\"68\">exactly ONE per tenant — the top container</text>\n  <line class=\"dg-link\" x1=\"340\" y1=\"86\" x2=\"340\" y2=\"112\"/>\n\n  <!-- Level 2: management group -->\n  <rect class=\"dg-box\" x=\"190\" y=\"112\" width=\"300\" height=\"72\" rx=\"10\"/>\n  <text class=\"dg-title\" x=\"212\" y=\"142\">MANAGEMENT GROUP</text>\n  <text class=\"dg-note\" x=\"212\" y=\"166\">nestable — organize by workload</text>\n  <text class=\"dg-side\" x=\"502\" y=\"142\">platform · identity ·</text>\n  <text class=\"dg-side\" x=\"502\" y=\"160\">connectivity · apps</text>\n  <line class=\"dg-link\" x1=\"340\" y1=\"184\" x2=\"340\" y2=\"210\"/>\n\n  <!-- Level 3: subscription -->\n  <rect class=\"dg-box\" x=\"190\" y=\"210\" width=\"300\" height=\"72\" rx=\"10\"/>\n  <text class=\"dg-title\" x=\"212\" y=\"240\">SUBSCRIPTION</text>\n  <text class=\"dg-note\" x=\"212\" y=\"264\">billing boundary + isolation boundary</text>\n  <text class=\"dg-side\" x=\"502\" y=\"240\">quotas · budgets ·</text>\n  <text class=\"dg-side\" x=\"502\" y=\"258\">dev / test / prod</text>\n  <line class=\"dg-link\" x1=\"340\" y1=\"282\" x2=\"340\" y2=\"308\"/>\n\n  <!-- Level 4: resource group -->\n  <rect class=\"dg-box\" x=\"190\" y=\"308\" width=\"300\" height=\"72\" rx=\"10\"/>\n  <text class=\"dg-title\" x=\"212\" y=\"338\">RESOURCE GROUP</text>\n  <text class=\"dg-note\" x=\"212\" y=\"362\">same lifecycle — delete group = delete all</text>\n  <text class=\"dg-side\" x=\"502\" y=\"338\">spans regions, NOT</text>\n  <text class=\"dg-side\" x=\"502\" y=\"356\">subscriptions</text>\n  <line class=\"dg-link\" x1=\"340\" y1=\"380\" x2=\"340\" y2=\"406\"/>\n\n  <!-- Level 5: resources -->\n  <rect class=\"dg-box dg-box-soft\" x=\"190\" y=\"406\" width=\"300\" height=\"94\" rx=\"10\"/>\n  <text class=\"dg-title\" x=\"212\" y=\"436\">RESOURCES</text>\n  <text class=\"dg-note\" x=\"212\" y=\"460\">VM · VNet · App Service · Cosmos DB</text>\n  <text class=\"dg-note\" x=\"212\" y=\"482\">Azure AI Foundry project + model deployment</text>\n\n  <!-- Rules of thumb -->\n  <text class=\"dg-kicker\" x=\"8\" y=\"530\">RULE OF THUMB</text>\n  <text class=\"dg-note\" x=\"140\" y=\"530\">grant or deny broadly = attach HIGH</text>\n  <text class=\"dg-answer\" x=\"380\" y=\"530\">tear down cleanly = 1 resource group</text>\n</svg>"
        },
        {
          "key": "memorize_3",
          "kind": "memorize",
          "label": "Memorize",
          "title": "MEMORIZE",
          "items": [
            "Hierarchy top→bottom: <strong>Management Group → Subscription → Resource Group → Resource</strong> (a resource lives inside all four).",
            "<strong>Root management group</strong> = exactly <strong>one</strong> per tenant, the top-level container.",
            "<strong>Inheritance flows DOWN:</strong> RBAC + Azure Policy set at a level apply to everything below it.",
            "<strong>Subscription</strong> = <strong>billing</strong> boundary + <strong>isolation</strong> boundary; tied to <strong>one Entra ID tenant</strong>; carries <strong>quotas/limits/budgets</strong>.",
            "<strong>Resource group</strong> = <strong>same-lifecycle</strong> container; <strong>delete cascades</strong> to all resources; <strong>spans regions, not subscriptions</strong>; (nearly) every resource belongs to exactly one.",
            "<strong>Azure Policy</strong> (what/how can deploy — preventive) vs <strong>Azure RBAC</strong> (who can do what — identity).",
            "Management group limit = <strong>10,000/tenant</strong>; Microsoft best practice = organize by <strong>workload</strong> (platform / applications), guided by the <strong>Cloud Adoption Framework</strong> + <strong>Landing Zones</strong>."
          ],
          "cardIds": [
            "C0006",
            "C0007",
            "C0008",
            "C0009",
            "C0010",
            "C0011",
            "C0012"
          ]
        },
        {
          "key": "do_4",
          "kind": "do",
          "label": "Lab checklist",
          "title": "DO",
          "items": [
            "In the Azure portal, open <strong>Management groups</strong> and note your tenant's <strong>root</strong> management group. Then open a <strong>subscription</strong> → <strong>Resource groups</strong> and see the nesting for yourself.",
            "Create a throwaway <strong>resource group</strong>, deploy one small resource into it, then <strong>delete the resource group</strong> and confirm the resource is gone with it (the cascade-delete behavior).",
            "Open a <strong>subscription → Cost Management + Budgets</strong> and set a small <strong>budget</strong> — see how the quota/limit lives at the subscription level.",
            "Look at <strong>Access control (IAM)</strong> on a resource group vs a subscription — notice a role assigned higher up shows as <strong>inherited</strong> on the levels below."
          ]
        },
        {
          "key": "gotchas_5",
          "kind": "gotchas",
          "label": "Gotchas",
          "title": "Gotchas & likely exam angles",
          "items": [
            "<strong>\"Grant a team access to every AI resource in a subscription with least effort\"</strong> → assign the <strong>RBAC role at the subscription scope</strong>; it <strong>inherits down</strong> to all resource groups and resources. Assigning per-resource is the wrong, high-effort distractor.",
            "<strong>\"Cleanly delete a whole app / environment\"</strong> → put its resources in <strong>one resource group</strong> (same lifecycle) and <strong>delete the group</strong>. Deleting resources one by one is the trap.",
            "<strong>Resource group spanning:</strong> it can span <strong>regions</strong> but <strong>never subscriptions</strong>. \"One VM in subscription A, one in subscription B, same resource group\" is impossible.",
            "<strong>Restrict deployments to certain regions / enforce a rule</strong> → <strong>Azure Policy</strong> (preventive), <em>not</em> RBAC. RBAC is about identity/permissions, not what may be deployed where.",
            "<strong>Isolation between workloads</strong> → separate <strong>subscriptions</strong> (isolated by default), not separate resource groups.",
            "<strong>Cap spend / quota</strong> → lives on the <strong>subscription</strong> (budgets/limits), not the resource group or management group.",
            "<strong>Root management group count</strong> → exactly <strong>one</strong> per tenant. \"Multiple root management groups\" is always wrong.",
            "<strong>Best-practice MG layout</strong> → by <strong>workload</strong> (platform/applications), not by geography or department. Geography/department \"work\" but aren't Microsoft's recommendation."
          ]
        },
        {
          "key": "verify_6",
          "kind": "verify",
          "label": "Verify & gaps",
          "title": "VERIFY / GAPS",
          "html": "\n<ul>\n<li><strong>Live-verified 2026-07-31</strong> against the two Microsoft Learn docs linked in Source. All core facts confirmed.</li>\n<li><strong>One correction the check surfaced:</strong> the video's absolute <em>\"there is no Azure resource without a resource group\"</em> is overstated. Microsoft Learn: a few resource types deploy at subscription/management-group/tenant scope, outside any resource group. The exam almost always tests the common-case rule (resource → one resource group), but don't treat \"every resource, no exceptions\" as gospel.</li>\n<li><strong>Bonus fact from the doc (worth knowing):</strong> a management-group tree supports up to <strong>6 levels of depth</strong> (not counting the root level or the subscription level).</li>\n<li><strong>Coverage:</strong> this section keeps <strong>1.5</strong> <em>partial</em> and moves <strong>1.12</strong> and <strong>1.9</strong> to <em>partial</em> (RBAC scope/inheritance; subscription quotas/budgets). Still uncovered for 1.12: managed identity, keyless auth, private networking (lectures 68–77). Still uncovered for 1.9: scaling, rate limits, model-level cost footprints (lectures 10–12, 78–84). Tracked in the coverage map.</li>\n</ul>\n      "
        }
      ],
      "video": null
    }
  ]
};
