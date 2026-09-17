// ============================================================================
// CONFIGURATION — Madhav & Hana's Personal Game
// ============================================================================

const CONFIG = {
    // Friend's name
    friendName: "Hana",
    
    // Your name
    myName: "Madhav",
    
    // Main friendship message (shown in mailbox)
    friendshipMessage: `Hey Leader! 😂

December 12, 2025... remember that day?

When a random Brawl Stars match turned into something more.

Who knew that playing together and making custom maps would actually make us real friends? 

I know you're drowning in exam prep right now, but I wanted to make you a tiny surprise.

All those times we created maps together, all those crazy moments... they meant something.

So here's a little camp, just for you.

Study hard, ace those exams, and then come back for some Brawl Stars with your favorite Leader. 🎮

Your friend,
Madhav

(And yes, I'm still calling you Leader even in a game. 🤣)`,

    // Final message before closing
    finalMessage: `Hana, I know your exams are intense right now.

But you've got this. 頑張ってね!

Take breaks, breathe, and remember that one game of Brawl Stars won't hurt when you need a break.

Go crush those studies. 📚✨

I'll be here, waiting for our next map-making session.

—Madhav`,

    // Quiz questions array
    // Format: { question: "Text", options: ["A", "B", "C", "D"], correct: 1, feedback: "Message" }
    // 'correct' is the index (0-3) of the correct answer
    quizQuestions: [
        {
            question: "Where did we first meet?",
            options: [
                "Instagram DM",
                "Brawl Stars random match 🎮",
                "A gaming server",
                "Through mutual friends"
            ],
            correct: 1,
            feedback: "CORRECT! 🎉\nFrom that random match to becoming real friends... 😂"
        },
        {
            question: "What's Hana's favorite character in Brawl Stars?",
            options: [
                "Spike 🌵",
                "Piper 💗",
                "Poco 🎸",
                "Colt 🔫"
            ],
            correct: 1,
            feedback: "CORRECT! 🎉\nPiper shots are deadly, just like Hana's gameplay! 💗"
        },
        {
            question: "What was our favorite thing to do together in Brawl Stars?",
            options: [
                "Grind trophies",
                "Create custom maps for each other 🗺️",
                "Join clans",
                "Watch tournaments"
            ],
            correct: 1,
            feedback: "CORRECT! 🎉\nThose custom maps were actually so creative! 🎨"
        },
        {
            question: "When does Hana usually disappear from gaming?",
            options: [
                "Late at night",
                "During exam season 📚",
                "Weekends only",
                "Never, she's always online"
            ],
            correct: 1,
            feedback: "CORRECT! 🎉\nStudies hit different, but we always come back. 💪"
        },
        {
            question: "What's the real reason Hana is called 'Leader'?",
            options: [
                "She's the clan leader",
                "Because she leads the way in friendship 👑",
                "She leads the team in ranked",
                "It's a joke we have"
            ],
            correct: 1,
            feedback: "CORRECT! 🎉\nYou're the leader of this friendship, no cap. 🤣"
        }
    ],

    // Camp objects messages
    campObjects: {
        campfire: {
            title: "Campfire 🔥",
            message: `December 12, 2025.

A random Brawl Stars match.

Two players from different places, different times.

And somehow... we became real friends.

That's pretty rare, haina? 🔥`
        },
        console: {
            title: "Game Console 🎮",
            message: `From "wanna play?" 
to custom maps
to actual friendship...

The game brought us together,
but it's the memories that keep us connected.

Piper shots forever! 💗🎮`
        },
        tent: {
            title: "Tent ⛺",
            message: `Exam season: The time when you disappear into textbooks.

But you always come back. Always.

And when you do, there's always a new map waiting.

So go crush those exams, Leader. 📚

We'll map again soon. ⛺`
        },
        cabin: {
            title: "Cabin 🏠",
            message: `You know what's funny?

We literally created maps together in a game,
and somehow those moments became real memories.

Every map you made was just... you being creative and dorky at the same time. 🤣

I miss those sessions, Leader.`
        },
        mailbox: {
            title: "Mailbox 📮",
            // This will use the friendshipMessage from above
            message: null // Populated from friendshipMessage in code
        },
        tree: {
            title: "Tree 🌲",
            message: `This tree represents something simple:

A friendship that grew from nothing.

No big plan, no expectations.

Just two people who said "wanna play?"

And now we're here. 

That's pretty beautiful, innit? 🌲✨`
        }
    }
};

// Easter egg counter
let moonTapCount = 0;
const MOON_TAPS_FOR_EGG = 5;
