CREATE EXTENSION IF NOT EXISTS 'uuid-ossp'; 

CREATE TABLE IF NOT EXISTS products (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	title TEXT NOT NULL,
	description TEXT NULL,
	price INTEGER NULL
);

CREATE TABLE IF NOT EXISTS stocks (
	product_id uuid NOT NULL,
	count INTEGER NULL,
    CONSTRAINT stocks_fk FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO products (title, description, price) VALUES
(
    'Harry Potter and the Sorcerers Stone', 
    'Harry Potter has no idea how famous he is. Thats because hes being raised by his miserable aunt and uncle who are terrified Harry will learn that hes really a wizard, just as his parents were. But everything changes when Harry is summoned to attend an infamous school for wizards, and he begins to discover some clues about his illustrious birthright. From the surprising way he is greeted by a lovable giant, to the unique curriculum and colorful faculty at his unusual school, Harry finds himself drawn deep inside a mystical world he never knew existed and closer to his own noble destiny.', 
    123
),
(
    'Harry Potter and the Chamber of Secrets',
    'The Dursleys were so mean that hideous that summer that all Harry Potter wanted was to get back to the Hogwarts School for Witchcraft and Wizardry. But just as hes packing his bags, Harry receives a warning from a strange, impish creature named Dobby who says that if Harry Potter returns to Hogwarts, disaster will strike.',
    141
),
(
    'Harry Potter And The Prisoner Of Azkaban',
    'For twelve long years, the dread fortress of Azkaban held an infamous prisoner named Sirius Black. Convicted of killing thirteen people with a single curse, he was said to be the heir apparent to the Dark Lord, Voldemort.',
    299
),
(
    'Andromeda Nebula',
    '',
    35
),
(
    'Foundation',
    'For twelve thousand years the Galactic Empire has ruled supreme. Now it is dying. Only Hari Seldon, creator of the revolutionary science of psychohistory, can see into the future—a dark age of ignorance, barbarism, and warfare that will last thirty thousand years. To preserve knowledge and save humanity, Seldon gathers the best minds in the Empire—both scientists and scholars—and brings them to a bleak planet at the edge of the galaxy to serve as a beacon of hope for future generations. He calls this sanctuary the Foundation.',
    68
);

INSERT INTO stocks (product_id, count) VALUES
('2c5d8bd0-9212-4c19-a297-d7a714c0db90', 1),
('f62a84c4-89ba-4f83-9fa0-ad9de48b8314', 17),
('45ea9194-b8a0-421c-b1f4-812d2e7db617', 9),
('94a958c5-98f9-4d4d-9076-b22aa828fbe2', 0),
('9b2343f1-1fcc-4646-803d-5d8c79fc91cf', 32);
