import { Book } from '../models';

const books: Book[] = [
  {
    "id": "1",
    "title": "Harry Potter and the Sorcerer's Stone",
    "author": "J.K. Rowling",
    "description": "Harry Potter has no idea how famous he is. That's because he's being raised by his miserable aunt and uncle who are terrified Harry will learn that he's really a wizard, just as his parents were. But everything changes when Harry is summoned to attend an infamous school for wizards, and he begins to discover some clues about his illustrious birthright. From the surprising way he is greeted by a lovable giant, to the unique curriculum and colorful faculty at his unusual school, Harry finds himself drawn deep inside a mystical world he never knew existed and closer to his own noble destiny.",
    "language": "English",
    "publishYear": 1998,
    "price": 123,
    "count": 90,
  },
  {
    "id": "2",
    "title": "Harry Potter and the Chamber of Secrets",
    "author": "J.K. Rowling",
    "description": "The Dursleys were so mean that hideous that summer that all Harry Potter wanted was to get back to the Hogwarts School for Witchcraft and Wizardry. But just as he's packing his bags, Harry receives a warning from a strange, impish creature named Dobby who says that if Harry Potter returns to Hogwarts, disaster will strike.",
    "language": "English",
    "publishYear": 2000, 
    "price": 140.99,
    "count": 29,
  },
  {
    "id": "3",
    "title": "Harry Potter And The Prisoner Of Azkaban",
    "author": "J.K. Rowling",
    "description": "For twelve long years, the dread fortress of Azkaban held an infamous prisoner named Sirius Black. Convicted of killing thirteen people with a single curse, he was said to be the heir apparent to the Dark Lord, Voldemort.",
    "language": "English",
    "publishYear": 2001,
    "price": 299,
    "count": 89,
  },
  {
    "id": "4",
    "title": "Andromeda Nebula",
    "author": "Ivan Yefremov",
    "description": "",
    "language": "Russian",
    "publishYear": 1957,
    "price": 35.2,
    "count": 2,
  },
  {
    "id": "5",
    "title": "Foundation",
    "author": "Isaac Asimov",
    "description": "For twelve thousand years the Galactic Empire has ruled supreme. Now it is dying. Only Hari Seldon, creator of the revolutionary science of psychohistory, can see into the future—a dark age of ignorance, barbarism, and warfare that will last thirty thousand years. To preserve knowledge and save humanity, Seldon gathers the best minds in the Empire—both scientists and scholars—and brings them to a bleak planet at the edge of the galaxy to serve as a beacon of hope for future generations. He calls this sanctuary the Foundation.",
    "language": "English",
    "publishYear": 2008,
    "price": 68.3,
    "count": 50,
  }
];

const getProductsById = async (id: string): Promise<Book> => books.find((book: Book) => book.id === id);

const getProductsList = async (): Promise<Book[]> => books;

export {
  getProductsById,
  getProductsList,
};
