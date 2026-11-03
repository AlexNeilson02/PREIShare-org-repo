# Embeddings learner notes (PREIshare)

## Plain-language definition

In PREIshare, an embedding is a long list of numbers that stands in for the
*idea* behind a piece of text — usually a property description, or the
sentence a buyer types when they search. Those numbers are not the original
sentence stored in disguise, not a short summary a person could read, and not
a keyword index (a lookup of exact words). They are only a compact way to put
"what this text is about" onto a map of meaning, so similar ideas can sit near
each other.

## Tiny intuition (not real model output)

To picture "near" vs "far," pretend we only had three numbers. This sketch is
for intuition; it is not output from a real model, and it does not pick how
long a real list should be.

- "peaceful lakeside retreat with proven guest stays" → [0.91, 0.79, 0.08]
- "calm cottage by the shore, strong weekend booking history" → [0.87, 0.81, 0.11]
  (nearby: same idea, different wording)
- "busy city penthouse next to bars and transit" → [0.12, 0.18, 0.93]
  (far from the lakeside stay)

A real embedding is a much longer list — often hundreds or thousands of
numbers. The picture stays the same: similar meaning produces similar number
patterns; unrelated meaning sits apart.

## PREIshare examples from our requirements

Buyer query (from the semantic search brief): "quiet cabin near water with good
rental upside"

Listing that should be close (different words, same idea): "A small cedar lodge
tucked against a private pond. Weekends stay booked with travelers; the last
owner ran it as a short-stay investment rather than a year-round home."

Listing that should be far: "Tilt-up warehouse with four loading docks, trailer
parking, and direct highway access for freight."

Why the lodge is closer: the query is asking for a low-key stay by water with
income from guests. The lodge never uses cabin, quiet, water, or rental
together, but it still describes that same kind of place. The warehouse is
logistics space, not a place to live or host guests, so its meaning should sit
far from the query. A word-matcher could miss the lodge and, if it got lucky
on a shared word like access, might even treat the warehouse as a hit.
Meaning-based search should not.

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

We want buyers to search PREIshare listings by meaning, not by repeating the
same words a sponsor happened to type. An embedding is just a list of numbers
that stands for a piece of text: we generate that list from a listing's
description, then store it with the property row. Later, a query like "quiet
cabin near water with good rental upside" gets turned into numbers the same
way, and we look for stored lists that sit nearby. Two descriptions can be
close even when they share almost no wording, and a warehouse listing should
stay far from a cabin search. Making the numbers and saving the numbers are
different jobs; turning "nearby" into a ranked list is the next step.

## Open questions before similarity ranking (Step 3)

- How does "closeness" (two number lists that look alike) become a ranked list of properties, best match first?
- What breaks if two embedding models are mixed in one table?
- In this repo, description is nullable on property_listings (a listing is allowed to have no description text), and the table may be empty. What happens to a listing with no description text to embed?
