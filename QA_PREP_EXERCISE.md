# Prep exercise week 4

As a preparation step for the upcoming Q&A, you need to work on the following exercise, which is based on the prep
exercise of the previous week.

## Exercise

Last week you updated your database to be normalized. Now that you have some more NoSQL knowledge, convert your database
to a document-based database. Think about the following:

- What are the collections?

Collections represent tables in the relational databases.

- What information will you embed in a document and which will you store normalised?

There is no information to be embedded. The requirement from the very first prep exercise has not changed: 'Many recipes might share the same ingredients or the same list of steps'. That effectively put the requirement on the DB to be normalized.

## Discussion (Try to write answers to these questions in text, provide queries and commands when necessary)

- What made you decide when to embed information? What assumptions did you make?

It is not possible to embed the information without breaking one of the requirements, see explanation above.

- If you were given PostgreSQL and MongoDB as choices to build the recipe's database at the beginning, which one would you
  choose and why?

Relational databases have a clean query language; I've gotten used to it. MongoDB is a completely different learning path. On top of that, I've noticed that aggregation operations take way more time than join operations in relational databases.
