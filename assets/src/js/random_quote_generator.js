

const {
    Component,
    mount,
    signal,
    xml,
    onWillStart,
    onMounted
} = owl;

class QuoteGenerator extends Component {
    static template = xml`
        <div class="container d-flex justify-content-center align-items-center min-vh-100">

            <div class="quote-card">

                <div class="quote-mark">
                    ❝
                </div>

                <h1 class="app-title">
                    QuoteVerse
                </h1>

                <p class="app-subtitle">
                    Discover inspiration one quote at a time
                </p>

                <div
                    t-if="this.loading()"
                    class="text-center"
                >
                    <div
                        class="spinner-border text-light"
                        role="status"
                    />
                </div>

                <div t-else="" class="quote-box">

                    <p class="quote-text">
                        <t t-out="this.quote()"/>
                    </p>

                    <h5 class="author">
                        — <t t-out="this.author()"/>
                    </h5>

                </div>

                <div class="button-group">

                    <button
                        class="btn btn-generate"
                        t-on-click="this.getQuote"
                    >
                        New Quote
                    </button>

                    <button
                        class="btn btn-copy"
                        t-on-click="this.copyQuote"
                    >
                        <t t-out="this.copyLabel()"/>
                    </button>

                </div>

            </div>

        </div>
    `;

    setup() {
        this.quote = signal("Loading quote...");
        this.author = signal("");
        this.loading = signal(false);
        this.copyLabel = signal("Copy");

        this.fallbackQuotes = [
            {
                quote: "Success is not final, failure is not fatal. It is the courage to continue that counts.",
                author: "Winston Churchill",
            },
            {
                quote: "The future depends on what you do today.",
                author: "Mahatma Gandhi",
            },
            {
                quote: "Believe you can and you're halfway there.",
                author: "Theodore Roosevelt",
            },
            {
                quote: "Dream big and dare to fail.",
                author: "Norman Vaughan",
            },
            {
                quote: "Do one thing every day that scares you.",
                author: "Eleanor Roosevelt",
            },
            {
                quote: "Your time is limited, don't waste it living someone else's life.",
                author: "Steve Jobs",
            },
        ];

        this.gradients = [
            "linear-gradient(-45deg,#667eea,#764ba2,#ff6b6b,#4facfe)",
            "linear-gradient(-45deg,#11998e,#38ef7d,#00c9ff,#92fe9d)",
            "linear-gradient(-45deg,#fc466b,#3f5efb,#6a11cb,#2575fc)",
            "linear-gradient(-45deg,#f7971e,#ffd200,#ff512f,#dd2476)",
            "linear-gradient(-45deg,#8e2de2,#4a00e0,#4776E6,#8E54E9)",
        ];


        onWillStart(async () => {
            this.getQuote();
        });
        onMounted(() => {
            this.getQuote();
        });
    }

    changeBackground() {
        const randomGradient =
            this.gradients[
            Math.floor(Math.random() * this.gradients.length)
            ];

        document.body.style.background = randomGradient;
        document.body.style.backgroundSize = "400% 400%";
    }

    displayQuote(quote, author) {
        this.quote.set(quote);
        this.author.set(author);
    }

    getFallbackQuote() {
        const random =
            this.fallbackQuotes[
            Math.floor(Math.random() * this.fallbackQuotes.length)
            ];

        this.displayQuote(random.quote, random.author);
    }

    /* ---------------- API ---------------- */

    async getQuote() {
        this.loading.set(true);

        try {
            const response = await fetch(
                "https://dummyjson.com/quotes/random"
            );

            if (!response.ok) {
                throw new Error("Failed");
            }

            const data = await response.json();

            this.displayQuote(
                data.quote,
                data.author
            );
        } catch (error) {
            this.getFallbackQuote();
        } finally {
            this.loading.set(false);
            this.changeBackground();
        }
    }

    async copyQuote() {

        await navigator.clipboard.writeText(
            `${this.quote()} - ${this.author()}`
        );

        this.copyLabel.set("Copied ✓");

        setTimeout(() => {
            this.copyLabel.set("Copied ✓");
        }, 2000);
    }
}
mount(QuoteGenerator, document.getElementById("app"));
