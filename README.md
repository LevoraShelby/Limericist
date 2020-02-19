# Limericist
A server that runs the limericist ARG (a type of online puzzle that expects collaborative efforts from its players).


To run the server, enter the command `node install` and then `node server/server.js` in the project directory in a UNIX terminal. The server runs on `localhost:8080`.


## Solutions and Explanations

### The Dunce
This limerick refers to a special type of checkmate in the game of chess called a *Fool's Mate*. Flint, Elizabeth, and Giovanni are all pawns, whose files are described by their first letter. The white pawn at f2, Flint, moves forward once. The black pawn at e2, Elizabeth (an intentional red herring to the queen piece), moves forward twice. The white pawn at g2, Giovanni, does the same. The black queen moves diagonally, positioning herself on the same rank as Giovanni, thus checkmating the white king. Hovering over the names in the limerick changes the second character in their name to '2', further hinting at their nature.

Typing pretty much anything close to "Fool's Mate" into the text field below the limerick yields the url leading to the next puzzle. The client-side javascript doesn't actually know the text that leads the player towards the next puzzle, neither does it hold the logic to determine whether the player has given the correct answer. Instead, it sends the answer that the player gave to the server, and if the server decides that the answer is correct, the server will send back the text to display.

### The Coin
My favorite puzzle! As the last line of the limerick says, the coin is, indeed, not fair: it's actually sending a message in binary, where a 1 is heads and a 0 is tails. The message, however, is not in plain ASCII, and is instead compressed using a Huffman encoding.

A request to the server to send the JSON file containing the Huffman encoding is made once the page loads. This can be detected by players who are watching for data being sent and recieived by the page (using the 'Network' tab in Chrome Devtools for instance). This file can also be found by players who look into the page source and read the script element with the id 'backgroundDownloadingHuffmanEncoding'. Once the players have found this, its just a matter of recording the coin flips (either manually or programatically) and using the huffman tree to decode the secret message, which reads, "good job. the url path for the next puzzle is gtrwj/books."

Each coin flip is sent over a websocket connection that is established once the page loads, sending one flip every three seconds. Websockets are used here in place of XMLHTTPRequests in order to avoid coin flips being skipped or repeated due to clock drift.

### The Books
The limerick refers to two bodies of text. Firstly, the *United States Code Title 52 -- Voting and Elections*, and secondly, the [Library of Babel](https://libraryofbabel.info/) website. The part after the limerick lists sections and subsections of 52 U.S.C. along with an associated number. This number enumerates a word in the associated section (section title not included), where a 1 would reference the first word in that section. Solving this book code gives the message, "request the first publication containing these words. use the first five characters in the location as the uniform resource identifier to the next area."

The players must then copy this block of text and search for it in the library of babel. The first listed book should have a title beginning with 'gdfsk'. The players should then try accessing the page at `http://<site>/gdfsk`.

### The Master
This puzzle is unfortunately busted. The strain it puts on the server is too much, and so it cannot be reasonably run (at least not without something called an 'opening book', which costs money). The server is running the chess engine called StockFish, currently the best free chess engine.

The players must beat the AI. The solution is actually quite simple. Since, "there is none that the master cannot beat" it should be able to beat even itself. And that is what the players must do. They need to run their own StockFish at a higher depth, in order to beat the one the server is running. Once a player wins, the message, "Checkmate! You win! The next path is /nzpvm/something." will be displayed. This doesn't lead anywhere for now, and marks the current end of the ARG.
