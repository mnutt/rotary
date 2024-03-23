#!/home/michael/.volta/tools/image/node/18.19.0/bin/node 

const jokes = [
  "What do you call a person with no body, and just a nose?\n.\n.\n.\n.\n.\n.\n. No body nose.",
  "Why do seagulls fly over the sea? \n.\n.\n.\n.\n.\n.\n.\n. Because if they flew over the bay, they would be bagels",
  `A man was driving a truckload of penguins down the road when his truck got a flat tire. A concerned citizen pulled over to offer help. The driver of the penguins said to the other man, “I’m on a tight schedule, I’ll give you 100 dollars to take these penguins to the zoo.”

The other man accepted and led the penguins out of sight.

Later that day, after the truck driver got his truck fixed, he was driving down the street and saw the man from before, walking down the street with all the penguins waddling behind him, each holding and licking an ice cream cone.

The driver pulls over and shouts to the man, “Hey I thought I gave you 100 dollars to take these penguins to the zoo!”

The man replies “Yeah, we had some money left over, so I took them out for ice cream afterward!”`
];

const joke = jokes[Math.floor(Math.random() * jokes.length)];

console.log(joke);
