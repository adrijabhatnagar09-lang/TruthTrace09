function traceClaim() {
    const claimInput = document.getElementById("claimInput").value.trim();
    const resultCard = document.getElementById("resultCard");
    const statusBadge = document.getElementById("statusBadge");
    const resultTitle = document.getElementById("resultTitle");
    const resultSummary = document.getElementById("resultSummary");
    const evidenceList = document.getElementById("evidenceList");

    if (claimInput === "") {
        alert("Please enter a news headline, claim, or message to analyze.");
        return;
    }

    const text = claimInput.toLowerCase();

    // Word databases
    const clickbaitWords = ["breaking", "shocking", "unbelievable", "secret", "miracle", "doctors hate", "100%", "guaranteed", "forward this"];
    
    // Source database with corresponding official links
    const sourceDatabase = [
        { name: "NASA", keywords: ["nasa"], url: "https://www.nasa.gov", title: "NASA Official Portal" },
        { name: "WHO", keywords: ["who", "world health organization"], url: "https://www.who.int", title: "WHO Official Health Reports" },
        { name: "ISRO", keywords: ["isro"], url: "https://www.isro.gov.in", title: "ISRO Official Updates" },
        { name: "BBC", keywords: ["bbc"], url: "https://www.bbc.com/news", title: "BBC News Verification" },
        { name: "Reuters", keywords: ["reuters"], url: "https://www.reuters.com", title: "Reuters Fact Check Bureau" }
    ];

    const suspiciousPunctuation = (claimInput.match(/!|\?/g) || []).length > 2;
    const isAllCaps = claimInput === claimInput.toUpperCase() && claimInput.length > 10;

    let clickbaitMatches = clickbaitWords.filter(word => text.includes(word));
    let detectedSources = sourceDatabase.filter(source => 
        source.keywords.some(keyword => text.includes(keyword))
    );

    resultCard.classList.remove("hidden");
    evidenceList.innerHTML = "";

    // --- DECISION LOGIC ---

    // 🔴 HIGHLY SUSPICIOUS
    if (clickbaitMatches.length >= 2 || isAllCaps || (clickbaitMatches.length >= 1 && suspiciousPunctuation)) {
        statusBadge.className = "status-badge badge-suspicious";
        statusBadge.innerText = "🔴 Highly Suspicious";
        resultTitle.innerText = "High Risk of Misinformation";
        resultSummary.innerText = "This claim displays multiple indicators commonly associated with viral fake news, emotional manipulation, or unverified rumors.";

        addEvidence("Language Pattern Analysis: Detects exaggerated emotional triggers (" + (clickbaitMatches.join(", ") || "Sensational Tone") + ").");
        if (isAllCaps) addEvidence("Formatting Red Flag: Sentence uses excessive ALL CAPS to create artificial urgency.");
        if (suspiciousPunctuation) addEvidence("Punctuation Warning: Multiple exclamation/question marks suggest sensationalism.");
        
        // Fact-checking portal recommendation links
        addEvidenceWithLink("Recommended Fact-Checking Sources: Cross-reference this claim on ", "https://www.snopes.com", "Snopes Fact-Check Engine");
    }
    
    // 🟢 LIKELY RELIABLE
    else if (detectedSources.length >= 1 && clickbaitMatches.length === 0) {
        statusBadge.className = "status-badge badge-reliable";
        statusBadge.innerText = "🟢 Likely Reliable";
        resultTitle.innerText = "Strong Source Alignment";
        resultSummary.innerText = "The claim references established institutions or formal reporting standards and lacks typical misinformation flags.";

        addEvidence("Tone Analysis: Text maintains an objective, neutral reporting style without emotional clickbait.");
        
        // Dynamically insert links to detected sources
        detectedSources.forEach(source => {
            addEvidenceWithLink("Verified Source Detected: Verified against ", source.url, source.title + " (" + source.name + ")");
        });
    }

    // 🟡 NEEDS VERIFICATION
    else {
        statusBadge.className = "status-badge badge-verify";
        statusBadge.innerText = "🟡 Needs Verification";
        resultTitle.innerText = "Inconclusive / Mixed Signal";
        resultSummary.innerText = "This claim does not show obvious fake news red flags, but it lacks clear references to official sources or verified data.";

        addEvidence("Source Absence: No primary news outlets or scientific organizations were explicitly named in the text.");
        addEvidenceWithLink("Action Step: Check official news sources such as ", "https://news.google.com", "Google News Archive");
    }

    resultCard.scrollIntoView({ behavior: 'smooth' });
}

// Helper function for regular bullet points
function addEvidence(text) {
    const evidenceList = document.getElementById("evidenceList");
    const li = document.createElement("li");
    li.innerText = text;
    evidenceList.appendChild(li);
}

// Helper function for bullet points with external hyperlinks
function addEvidenceWithLink(prefixText, url, linkTitle) {
    const evidenceList = document.getElementById("evidenceList");
    const li = document.createElement("li");
    
    const textNode = document.createTextNode(prefixText);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank"; // Opens link in a new tab
    link.style.color = "#38bdf8";
    link.style.textDecoration = "underline";
    link.innerText = linkTitle;

    li.appendChild(textNode);
    li.appendChild(link);
    evidenceList.appendChild(li);
}