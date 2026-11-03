# Vector search learner notes (PREIshare)

## 1. My plain-language definition

_[fill in myself]_

## 2. How a search runs (steps I can explain)

An **embedding** is a list of numbers that stands for the meaning of a piece
of text (a listing description, or the words a buyer types). **Vector search**
is ranking listings by how close those number lists are, not by counting
shared words.

1. The buyer types a query (a plain-language search phrase).
2. The system creates a **query embedding** (a number list for that phrase)
   using the **same model** the listings used. A **model** is the program that
   turns text into numbers. Mixing models makes the numbers incomparable.
   This notes file does not pick which model.
3. The system compares that query embedding to the **stored property
   embeddings** (the number lists already saved with each listing).
4. Each property gets a **score**. That score is either a **distance** (how
   far apart two number lists are) or a **similarity** (how alike they are).
   This file does not pick which measuring rule later search will use.
5. Results are **ranked** best-first (closest meaning at the top) and cut to
   **top-K** (only the first K listings; K is a count we choose later).

```text
[Buyer query text]
        |
        v
[Query embedding] ----compare----> [Property embeddings in database]
        |
        v
[Scores] -> [Sort best-first] -> [Top-K listings shown]
```

## 3. Keyword search vs vector search (same query)

Take the buyer query "quiet cabin near water with good rental upside" and the
listing "lakeside cottage, peaceful, strong short-term income."

**Keyword search** looks for the same words (or overlapping letters).
**Vector search** looks for nearby meaning.

| Approach | What it looks for | Likely miss |
|----------|-------------------|-------------|
| Keyword search | Shared spelling between that query and the listing text | The lakeside cottage — same idea (a calm stay by water with rental income) but almost none of the query's exact words (quiet, cabin, water, rental) |
| Vector search | How close the query's number list is to the listing's stored number list | A listing whose description is empty, misleading, or was never turned into an embedding, so there is nothing honest to compare |

Vector search can still miss when the listing text is empty, misleading, or
was never embedded. Closeness of numbers cannot invent meaning that was never
written down.

## 4. Worked ranking examples (no real math required)

_[fill in myself]_

### Example A — clear winner

Query: "family-friendly home near good schools"

| Listing blurb | Expected rank | Why |
|---------------|---------------|-----|
| | | |
| | | |

### Example B — different words, same intent

Query: "cabin by the lake"

| Listing blurb | Expected rank | Why |
|---------------|---------------|-----|
| | | |
| | | |

## 5. Top-K and scores (what I will check later)

- **Top-K** returns only the K nearest listings, not every row in the table. K
  is a whole number we will choose later (this file does not set it).
- **Distance** means smaller is closer. If the score is a distance, the best
  hit is the smallest number.
- **Similarity** means larger is closer. If the score is a similarity, the
  best hit is the largest number.
- I must know which kind my SQL returns so I do not sort backwards (putting
  the worst match first).
- A score alone isn't enough in the UI (the on-screen list). I also want the
  property id (the listing's stable identifier) and a readable label (a title
  or short snippet) so I can debug why it ranked there.

## 6. What good ranking is *not*

Good ranking is not:

- Alphabetical by title.
- Newest-first, unless that is a deliberate product rule sitting *after*
  meaning rank.
- An **ILIKE** keyword filter dressed up as semantic. ILIKE is a
  case-insensitive "does this text contain these letters" check. It is still
  keyword matching, not meaning.
- Comparing embeddings built with different models or dimensions (how many
  numbers are in each list). Same length is not enough if the model differs.
  This file does not pick a model or a dimension count.

## 7. Assessment questions for a future match_properties-style function

A **function** here means a named helper that takes search input and returns
listings. I would use these questions to judge a future match_properties-style
function:

1. Does it take a query embedding, or take query text and embed it with the
   same model the listings used?
2. Does it compare against the stored property embedding column, not raw
   description text?
3. Does it order best-first, in the correct direction for whichever score it
   uses — ascending for distance, descending for similarity?
4. Does it support top-K?
5. Does each row include enough to explain the hit — property id, a readable
   label or snippet, and the score?
6. Does it avoid silently mixing embedding models or sizes?
7. If the sample data has a deliberate different-wording match, does it rank
   above an unrelated keyword distractor?

## 8. Link back to requirements

_[fill in myself]_

## 9. Open questions for later steps

- Which **distance metric** (the named rule for measuring closeness) will the
  pgvector migration use? Name only — this file does not pick it.
  (**pgvector** is a PostgreSQL add-on that can store number lists and compare
  them.)
- What default K should the first **API** (the server endpoint the search page
  will call) use?
- What minimum fields should the first UI show per hit?
- In this repo, description is nullable in property_listings (a listing is
  allowed to have no description text), so what should happen to listings with
  no text to embed — are they excluded from results, and does the UI say so?
