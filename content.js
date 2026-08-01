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
      "objectives": "1.5, 1.12",
      "source": "`input/transcripts/01-Azure_Global_Backbone.md`, `input/transcripts/02-Azure_Regions_And_Datacenters.md` (Udemy AI-103 / Christopher Nett, recorded 2026). Facts cross-checked against general Azure Well-Architected / global-infrastructure documentation.",
      "html": "\n<h3>The 20% that matters (Pareto summary)</h3>\n<ul>\n<li><strong>Region</strong> = a geographically distinct location containing <strong>one or more datacenters</strong>. It's what you pick when you deploy a resource. A region is *not* a single datacenter.</li>\n<li><strong>Region pair</strong> = <strong>two</strong> regions in the <strong>same geography</strong>, <strong>defined by Microsoft</strong> (you cannot change them). Benefits: staged updates (one region at a time), geo-redundant replication for some services (e.g., <strong>Geo-Redundant Storage (GRS)</strong> — Azure Storage automatically copying your data to the paired region), and your data stays in-geography.</li>\n<li><strong>Availability Zone (AZ)</strong> = a <strong>physically separate</strong> location *within one region*, with <strong>independent power, cooling, and networking</strong>. Standard for larger regions = <strong>minimum 3</strong> zones. Protects against a single-datacenter failure.</li>\n<li><strong>Not all services/models are available in every region</strong> — especially newer ones. This is the AI-relevant fact: a specific model in Azure OpenAI or <strong>Azure AI Foundry</strong> (Microsoft's platform for building AI apps and agents) may only exist in certain regions.</li>\n<li><strong>Region choice drives data residency &amp; compliance.</strong> *Data residency* = where your data physically lives. The rules are things like GDPR (European Union data-privacy law), HIPAA (US health-data privacy law), PCI DSS (payment-card security standard), and SOC 2 / ISO (security-audit certifications). Pick the region/geography that meets the rule.</li>\n</ul>\n<p>---</p>\n<h3>Concepts (plain language)</h3>\n<p><strong>The global backbone.</strong> The physical layer under Azure: 60+ regions, 130,000+ miles of fiber plus subsea (undersea) cables, network edge sites, and thousands of peering connections (direct links between Microsoft's network and other networks). Microsoft keeps expanding it. Takeaway for the exam: Azure is globally distributed, and Microsoft brings regions *close to users* to cut latency (the delay before data arrives).</p>\n<p><strong>Regions.</strong> A region is the deployment target you select (e.g., *East US*, *North Europe*). Three things to remember: 1. A region is a set of datacenters, not one building — so a single datacenter failure doesn't automatically take the region down. 2. Service availability <strong>varies by region</strong> (newer/\"exotic\" services land in prominent regions first). 3. Some services are <strong>global</strong> (reachable from anywhere, no region choice) and some are <strong>regional</strong> (you must pick a region — e.g., virtual machines (VMs), which are cloud servers you run).</p>\n<p><strong>Region pairs.</strong> Microsoft links two regions in the same geography (e.g., East US ↔ West US). You don't choose them and can't change them. Why they help:</p>\n<ul>\n<li><strong>Staged updates</strong> — platform updates never hit both paired regions at once.</li>\n<li><strong>Disaster recovery</strong> — if one region fails, the paired region can back up some services.</li>\n<li><strong>Geo-redundant replication</strong> — services like Azure Storage can auto-replicate between the pair.</li>\n<li><strong>Data sovereignty</strong> (the legal requirement that data stays within a country's or region's borders) — replication stays inside the same geographic boundary, so data doesn't cross continents.</li>\n</ul>\n<p><strong>Availability Zones.</strong> Inside a *single* region, AZs are separate physical locations (AZ1/AZ2/AZ3), each with its own power, cooling, and network, interconnected by low-latency links. A larger region typically has <strong>3</strong>. You spread a workload (VMs, disks, load balancers — which distribute incoming traffic across servers) across zones so a one-datacenter/one-zone outage doesn't take your app down. Some services are <strong>zone-redundant</strong> and replicate across zones automatically.</p>\n<p><strong>Region pair vs Availability Zone — the key distinction the exam leans on:</strong></p>\n<ul>\n<li>AZ protects against a <strong>datacenter</strong> failure *within* a region.</li>\n<li>Region pair protects against an <strong>entire region</strong> failure *across* two regions in the same geography.</li>\n</ul>\n<p><strong>The demo (transcript 02).</strong> The Azure *regions list* shows, per region: AZ support (yes/no), its paired region (if any), physical location (often only the state/country — exact datacenter sites are hidden for security), and its geography. Newer regions (e.g., Austria East) may have AZs but <strong>no pair yet</strong>. The *global infrastructure map* (a spinning globe) lets you filter regions by compliance (GDPR, HIPAA, PCI DSS, SOC 2/ISO), disaster-recovery/pairing, sustainability, and AZ presence.</p>\n<p>---</p>\n<h3>Diagram — Azure infrastructure hierarchy &amp; resiliency</h3>\n<pre class=\"guide-diagram\">GEOGRAPHY (e.g., United States)  — compliance / data-residency boundary\n│\n├── REGION PAIR  (Microsoft-defined, same geography, staged updates, geo-redundant)\n│   │\n│   ├── REGION: East US ─────────────────┐        REGION: West US  (the pair)\n│   │   ├── AZ1  [≥1 datacenter]         │        └── (backup for some services;\n│   │   ├── AZ2  [≥1 datacenter]  ◄──────┘             replication stays in-geo)\n│   │   └── AZ3  [≥1 datacenter]\n│   │      independent power / cooling / network, interconnected\n│   │      → survives a single-datacenter (zone) failure\n│   │\n│   └── (whole-region outage) ──► fail over to the paired region\n\nResiliency decision:\n  single datacenter fails  ─► Availability Zones (within region)\n  whole region fails       ─► Region Pair (across regions, same geography)\n  data must stay in-country ─► choose the Region / Geography (residency)\n  model/service missing     ─► check regional availability, deploy where offered</pre>\n<p>---</p>\n<h3>Gotchas &amp; likely exam angles</h3>\n<ul>\n<li><strong>\"Who defines region pairs?\"</strong> → Microsoft. Any answer saying the customer configures pairings is wrong.</li>\n<li><strong>AZ vs region pair mix-up</strong> — read whether the failure is a *datacenter* (→ AZ) or a *whole region* (→ pair).</li>\n<li><strong>\"Model not available in my region\"</strong> → it's *regional availability*, not a bug; deploy where the model is offered. (Most AI-relevant hook in this section.)</li>\n<li><strong>Data residency</strong> → solved by *region/geography selection*, not by <strong>Role-Based Access Control (RBAC)</strong> (which controls *who* can access a resource) or private endpoints (private network connections to a service).</li>\n<li><strong>A region is not one datacenter</strong> — single-datacenter-as-single-point-of-failure is the wrong mental model.</li>\n</ul>\n<h3>⚠️ VERIFY / GAPS</h3>\n<ul>\n<li>Nothing unverified — all facts here are well-established Azure fundamentals.</li>\n<li><strong>Coverage:</strong> objective <strong>1.5</strong> is now *partial*. Still uncovered for 1.5: private networking topology and the *Foundry-specific* deployment/infra design (comes later, lectures 28–34). Tracked in <code>output/coverage_map.md</code>.</li>\n</ul>\n      ",
      "video": "videos/section_01_azure_global_infrastructure.mp4"
    },
    {
      "id": "section_02_azure_resource_hierarchy",
      "title": "Azure Resource Hierarchy & Governance (Management Groups, Subscriptions, Resource Groups, Resources)",
      "objectives": "1.5, 1.12, 1.9",
      "source": "`input/transcripts/03-Azure_Resource_Hierarchy.md` (Udemy AI-103 / Christopher Nett, recorded 2026). Load-bearing facts **verified live against Microsoft Learn on 2026-07-31**:",
      "html": "\n<h3>The 20% that matters (Pareto summary)</h3>\n<ul>\n<li><strong>Four containers, top to bottom: Management Group → Subscription → Resource Group → Resource.</strong> Every resource lives inside all four. Memorize this order — it's the spine of everything else.</li>\n<li><strong>Root management group</strong> = the single top-level container that *every* Azure tenant has. Exactly <strong>one</strong> per tenant; you can't have zero or two.</li>\n<li><strong>Inheritance flows DOWN.</strong> Anything you set at a level (Azure <strong>RBAC</strong> role assignments and <strong>Azure Policy</strong> rules) automatically applies to *everything below it*. Grant access at the root management group → the person can reach every resource in the tenant.</li>\n<li><strong>Subscription</strong> = the <strong>billing boundary</strong> and an <strong>isolation boundary</strong>. It's tied to exactly one <strong>Entra ID</strong> (Microsoft's cloud identity service, formerly Azure Active Directory) tenant, and it's where <strong>quotas, limits, and budgets</strong> live (e.g., \"cap spend at $200/month\").</li>\n<li><strong>Resource group</strong> = a container for resources that <strong>share the same lifecycle</strong>. Deleting the resource group deletes <strong>everything in it</strong> in one action. A resource group can <strong>span regions</strong> but <strong>cannot span subscriptions</strong>.</li>\n<li><strong>Azure Policy vs Azure RBAC:</strong> Policy controls <strong>what can be deployed/how</strong> (preventive rules, e.g., \"no resources outside West Europe\"); RBAC controls <strong>who can do what</strong> (identity-based permissions). Different tools, both inherit down.</li>\n</ul>\n<p>---</p>\n<h3>Concepts (plain language)</h3>\n<p><strong>Why a hierarchy at all — \"governance.\"</strong> *Governance* just means the rules and structure that keep an Azure environment secure, cost-controlled, performant, and available. Azure gives you four nested containers to hang those rules on. Get the structure right and security/cost/compliance settings apply automatically to everything inside.</p>\n<p><strong>Management groups (top).</strong> *Management groups* are the top-level containers used to organize an entire Azure environment. Every tenant (your company's Azure account boundary) starts with one <strong>root management group</strong> — the top of the tree, exactly one, always present. Below it you can create more management groups and nest them in layers. Their whole point: they <strong>enable inheritance</strong> of access controls (RBAC) and security/compliance settings (Azure Policy) *down* to everything beneath them. A single tenant can hold up to <strong>10,000 management groups</strong> (a limit almost nobody hits).</p>\n<ul>\n<li><strong>Microsoft's recommended organization = by workload function, not by geography or department.</strong> The best-practice pattern: a <strong>platform</strong> management group holding sub-groups like <strong>identity</strong>, <strong>management</strong>, and <strong>connectivity</strong>; plus an <strong>applications</strong> management group split into <strong>modern apps</strong> (serverless/containerized) and <strong>legacy apps</strong> (traditional virtual machines). You *could* instead organize by country (US / India) or department (IT / HR) — it works, but it's not what Microsoft recommends.</li>\n<li><strong>But there's no single \"correct\" design.</strong> Microsoft explicitly says to start from their best practice and adapt to your own requirements.</li>\n</ul>\n<p><strong>Subscriptions (second level).</strong> A *subscription* is the <strong>billing container</strong> — it's what ties resource deployment to how you pay (a credit card for individuals, an Enterprise Agreement for companies). It's more than billing, though:</p>\n<ul>\n<li><strong>Isolation boundary.</strong> By default resources in two different subscriptions <strong>cannot talk to each other</strong> — that's a security benefit you get for free.</li>\n<li><strong>Access-control anchor.</strong> Each subscription is tied to one <strong>Entra ID</strong> tenant, and you can assign RBAC at the subscription level.</li>\n<li><strong>Quotas, limits, and budgets.</strong> You can enforce caps — e.g., a <strong>budget</strong> of \"$200/month max,\" or regional deployment limits.</li>\n<li><strong>Common patterns:</strong> split one app across <strong>dev / test / prod</strong> subscriptions (staging between environments), or give each <strong>business unit</strong> its own subscription (makes cost allocation easy).</li>\n</ul>\n<p><strong>Resource groups (third level).</strong> A *resource group* is a named container that holds the actual resources. Rules the exam leans on:</p>\n<ul>\n<li>Nearly every resource belongs to <strong>exactly one</strong> resource group. (Strictly, Microsoft Learn notes a *few* resource types deploy at subscription/management-group/tenant scope and live *outside* a resource group — the video said \"there is no resource without a resource group,\" which is the common-case rule but not literally universal.)</li>\n<li>A resource group can hold resources <strong>from multiple regions</strong> (a VM in East US and one in West US), but <strong>all within a single subscription</strong> — it <strong>cannot span subscriptions</strong>.</li>\n<li><strong>Deleting the resource group deletes every resource inside it</strong> in one shot — hugely convenient for tearing down an app with 70–80 resources.</li>\n<li><strong>Best practice: group resources that share the same lifecycle.</strong> All the pieces of one app/environment (VMs, networks, load balancers, DNS zones, firewall) go in one resource group, so you can create or delete them together.</li>\n</ul>\n<p><strong>Resources (bottom).</strong> The actual things you deploy: virtual machines, virtual networks, app services, Cosmos DB, load balancers, DNS zones, Azure Firewall — and, for us, <strong>Azure AI Foundry</strong> projects and model deployments. Lowest level of the tree.</p>\n<p><strong>Inheritance + the two governance tools.</strong> You attach governance at any level and it <strong>flows down</strong> to every level beneath:</p>\n<ul>\n<li><strong>Azure RBAC</strong> (Role-Based Access Control) = *who* can do *what*. Assign a role at the management group → it applies to all subscriptions, resource groups, and resources under it. Assign it at a subscription → only that subscription's resource groups and resources. Assign at a resource group → only its resources.</li>\n<li><strong>Azure Policy</strong> = preventive rules on *what/how* things deploy — e.g., \"block deployments to any region except West Europe.\" Also inherits down.</li>\n<li>The higher you attach a rule, the broader it reaches — that's why a good hierarchy makes governance easy.</li>\n</ul>\n<p><strong>Frameworks: Cloud Adoption Framework &amp; Landing Zones.</strong> The <strong>Cloud Adoption Framework (CAF)</strong> is Microsoft's written guidance (hundreds of pages) for organizing an Azure environment with governance and security by default. Within it, a <strong>Landing Zone</strong> is a pre-built starting point + operating model + platform that bigger customers use as their foundation. Exam-relevant only as vocabulary: CAF = the framework, Landing Zone = the ready-made starting environment it describes.</p>\n<p>---</p>\n<h3>Diagram — the hierarchy and how governance inherits down</h3>\n<pre class=\"guide-diagram\">                        ┌─────────────────────────────┐\n   apply RBAC / Policy  │  ROOT MANAGEMENT GROUP       │  exactly ONE per tenant\n   HERE  → reaches      │  (top container, all rsrcs)  │\n   everything below     └──────────────┬──────────────┘\n        │                              │  (nest more mgmt groups: platform / applications …)\n        │               ┌──────────────┴──────────────┐\n        ▼               │  MANAGEMENT GROUP            │  best practice: organize by WORKLOAD\n   INHERITANCE          │  (e.g., \"applications\")      │  (platform: identity/mgmt/connectivity;\n   FLOWS DOWN           └──────────────┬──────────────┘   applications: modern / legacy)\n        │                              │\n        │               ┌──────────────┴──────────────┐\n        │               │  SUBSCRIPTION                │  BILLING boundary + ISOLATION boundary\n        │               │  (e.g., app1-prod)           │  + quotas/limits/budgets · 1 Entra tenant\n        │               └──────────────┬──────────────┘  (patterns: dev/test/prod OR per business unit)\n        │                              │\n        │               ┌──────────────┴──────────────┐\n        │               │  RESOURCE GROUP              │  same-LIFECYCLE group · delete = delete all\n        ▼               │  (e.g., \"prod\")              │  spans regions, NOT subscriptions\n                        └──────────────┬──────────────┘\n                                       │\n                        ┌──────────────┴──────────────┐\n                        │  RESOURCES                   │  VM · VNet · App Service · Cosmos DB ·\n                        │  (incl. Foundry project)     │  load balancer · Foundry model deployment\n                        └─────────────────────────────┘\n\nGovernance rules of thumb:\n  grant/deny broadly            ─► attach RBAC / Policy HIGH (mgmt group or subscription) → inherits down\n  tear an app down cleanly      ─► put same-lifecycle resources in ONE resource group, delete the group\n  keep workloads from talking   ─► separate SUBSCRIPTIONS (isolated by default)\n  cap spend                     ─► budget/quota on the SUBSCRIPTION\n  restrict where things deploy  ─► Azure POLICY (e.g., allowed regions) — preventive, not identity</pre>\n<p>---</p>\n<h3>Gotchas &amp; likely exam angles</h3>\n<ul>\n<li><strong>\"Grant a team access to every AI resource in a subscription with least effort\"</strong> → assign the <strong>RBAC role at the subscription scope</strong>; it <strong>inherits down</strong> to all resource groups and resources. Assigning per-resource is the wrong, high-effort distractor.</li>\n<li><strong>\"Cleanly delete a whole app / environment\"</strong> → put its resources in <strong>one resource group</strong> (same lifecycle) and <strong>delete the group</strong>. Deleting resources one by one is the trap.</li>\n<li><strong>Resource group spanning:</strong> it can span <strong>regions</strong> but <strong>never subscriptions</strong>. \"One VM in subscription A, one in subscription B, same resource group\" is impossible.</li>\n<li><strong>Restrict deployments to certain regions / enforce a rule</strong> → <strong>Azure Policy</strong> (preventive), *not* RBAC. RBAC is about identity/permissions, not what may be deployed where.</li>\n<li><strong>Isolation between workloads</strong> → separate <strong>subscriptions</strong> (isolated by default), not separate resource groups.</li>\n<li><strong>Cap spend / quota</strong> → lives on the <strong>subscription</strong> (budgets/limits), not the resource group or management group.</li>\n<li><strong>Root management group count</strong> → exactly <strong>one</strong> per tenant. \"Multiple root management groups\" is always wrong.</li>\n<li><strong>Best-practice MG layout</strong> → by <strong>workload</strong> (platform/applications), not by geography or department. Geography/department \"work\" but aren't Microsoft's recommendation.</li>\n</ul>\n<h3>⚠️ VERIFY / GAPS</h3>\n<ul>\n<li><strong>Live-verified 2026-07-31</strong> against the two Microsoft Learn docs linked in Source. All core facts confirmed.</li>\n<li><strong>One correction the check surfaced:</strong> the video's absolute *\"there is no Azure resource without a resource group\"* is overstated. Microsoft Learn: a few resource types deploy at subscription/management-group/tenant scope, outside any resource group. The exam almost always tests the common-case rule (resource → one resource group), but don't treat \"every resource, no exceptions\" as gospel.</li>\n<li><strong>Bonus fact from the doc (worth knowing):</strong> a management-group tree supports up to <strong>6 levels of depth</strong> (not counting the root level or the subscription level).</li>\n<li><strong>Coverage:</strong> this section keeps <strong>1.5</strong> *partial* and moves <strong>1.12</strong> and <strong>1.9</strong> to *partial* (RBAC scope/inheritance; subscription quotas/budgets). Still uncovered for 1.12: managed identity, keyless auth, private networking (lectures 68–77). Still uncovered for 1.9: scaling, rate limits, model-level cost footprints (lectures 10–12, 78–84). Tracked in <code>output/coverage_map.md</code>.</li>\n</ul>\n      ",
      "video": null
    }
  ]
};
