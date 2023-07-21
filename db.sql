
CREATE TABLE
    recipe(
        id SERIAL,
        title VARCHAR NOT NULL,
        ingredients TEXT NOT NULL,
        category_id INT NOT NULL,
        photo VARCHAR NOT NULL
    );

CREATE TABLE 
    category (
    id SERIAL,
    name VARCHAR NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id SERIAL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE recipe DROP COLUMN category;

ALTER TABLE recipe ADD COLUMN category_id INT;

UPDATE recipe SET category_id=1 WHERE photo='https://placehold.co/600x400';

ALTER TABLE recipe ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE recipe ADD FOREIGN KEY (category_id) REFERENCES category(id);


SELECT * FROM category;

ALTER TABLE category ADD CONSTRAINT id UNIQUE (id);

DELETE FROM recipe WHERE category_id=1;

INSERT INTO recipe(title,ingredients,category_id,photo) VALUES('Spring Rolls','Kulit lumpia, kol, wortel, tauge, udang cincang, daging ayam cincang, daun bawang, saus soya, saus oyster, minyak wijen, dan bumbu lainnya.','1','https://placehold.co/600x400');

DROP TABLE category;

ALTER TABLE recipe DROP CONSTRAINT category_id;

DROP DATABASE myapi;


SELECT recipe.id, recipe.title, recipe.ingredients, recipe.photo, category.name AS category FROM recipe JOIN category ON recipe.category_id = category.id WHERE title ILIKE '%spring%';

SELECT * FROM category WHERE name ILIKE '%Main%';

DROP TABLE users;