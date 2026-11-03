# Embeddings learner notes (PREIshare)

## Plain-language definition

An embedding is a list of numbers that stands for the *meaning* of a piece of
text (for us: a property description or a buyer's search phrase). It is not a
keyword index and not a human-readable summary.

## Tiny intuition (not real model output)

Imagine a toy 3-number embedding just to picture "near" vs "far":

- "lakefront cabin, quiet, strong Airbnb history" → [0.9, 0.8, 0.1]
- "waterfront cottage, peaceful, good short-term rental" → [0.88, 0.82, 0.12]  (nearby)
- "downtown loft near nightlife and offices" → [0.1, 0.2, 0.95]  (far from the cabin)

Real embeddings are much longer lists (often hundreds or thousands of numbers).
The idea is the same: similar meaning → similar number patterns.

## PREIshare examples from our requirements

_[fill in myself]_

## Generation vs storage (do not mix these up)

These are two different jobs. Do not treat them as one step.

An **embedding model** is a program that turns text into that number list. We
often reach it through an **API** (a remote service you send text to and get
numbers back). This notes file does not pick a provider, a model, or how many
numbers are in the list. Those choices come later.

| Stage | What happens | Where |
|-------|--------------|-------|
| Generation | Text goes into an embedding model/API; a number-list comes back | App/code side; later a TypeScript module (a small file of typed app code) |
| Storage | That number-list is saved with the property row | Database; later Supabase PostgreSQL (our project's database) + pgvector (a PostgreSQL add-on that can store those number lists) |

Search will later embed the buyer's query (generation), then compare it to stored property embeddings (storage + comparison). Ranking is Step 3.

## Misconceptions to watch for when reviewing agent code later

- Thinking the embedding stores the original sentence as text inside the vector (another word for the number list). It does not. The original words are not sitting inside those numbers.
- Assuming two listings must share the same words to be "close." Closeness here is about meaning, not spelling.
- Forgetting every embedding in one table must come from the same model — not just the same list length. Two different models can produce the same number of values and still be incomparable, so swapping models means regenerating every stored vector.
- Mixing up "create embedding" (generation: ask the model for a number list) with "INSERT into database" (storage: save a new row, including that number list).
- Believing one number in the list is a human-readable score on its own. A single position in the list is not a rating you can read like "price" or "stars."

## What I can explain to a teammate in 60 seconds

_[fill in myself]_

## Open questions before similarity ranking (Step 3)

- How does "closeness" (two number lists that look alike) become a ranked list of properties, best match first?
- What breaks if two embedding models are mixed in one table?
- In this repo, description is nullable on property_listings (a listing is allowed to have no description text), and the table may be empty. What happens to a listing with no description text to embed?
